//paste.controller.js
import { PrismaClient } from "@prisma/client";
import { generateSlug } from "../utils/generateSlug.js";

const prisma = new PrismaClient();

/* ------------------ HEALTH CHECK ------------------ */
export const healthCheck = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
};

/* ------------------ CREATE PASTE ------------------ */
export const createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "content is required" });
    }

    if (ttl_seconds && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ error: "ttl_seconds must be >= 1" });
    }

    if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ error: "max_views must be >= 1" });
    }

    const slug = generateSlug();

    const expiresAt = ttl_seconds
      ? new Date(Date.now() + ttl_seconds * 1000)
      : null;

    const paste = await prisma.paste.create({
      data: {
        slug,
        content,
        maxViews: max_views ?? null,
        expiresAt,
        viewCount: 0
      }
    });

    return res.status(201).json({
      id: paste.slug,
      url: `${process.env.BASE_URL}/p/${paste.slug}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to create paste" });
  }
};

/* ------------------ FIXED TIME HELPER (for tests) ------------------ */
const getNow = (req) => {
  if (process.env.TEST_MODE === "1" && req.headers["x-test-now-ms"]) {
    const t = Number(req.headers["x-test-now-ms"]);
    if (!isNaN(t)) return new Date(t);
  }
  return new Date();
};

/* ------------------ GET PASTE (JSON API) ------------------ */
export const getPasteApi = async (req, res) => {
  try {
    const { id } = req.params;
    const paste = await prisma.paste.findUnique({ where: { slug: id } });

    if (!paste) return res.status(404).json({ error: "not found" });

    const now = getNow(req);

    // expiry check
    if (paste.expiresAt && now > paste.expiresAt) {
      await prisma.paste.delete({ where: { slug: id } });
      return res.status(404).json({ error: "expired" });
    }

    // view limit check
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      await prisma.paste.delete({ where: { slug: id } });
      return res.status(404).json({ error: "view limit exceeded" });
    }

    // increment view count
    const updated = await prisma.paste.update({
      where: { slug: id },
      data: { viewCount: { increment: 1 } }
    });

    return res.status(200).json({
      content: updated.content,
      remaining_views: updated.maxViews
        ? Math.max(0, updated.maxViews - updated.viewCount)
        : null,
      expires_at: updated.expiresAt ?? null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "error fetching paste" });
  }
};

/* ------------------ GET PASTE (HTML VIEW) ------------------ */
export const getPasteHtml = async (req, res) => {
  try {
    const { id } = req.params;
    const paste = await prisma.paste.findUnique({ where: { slug: id } });

    if (!paste) return res.status(404).send("Not Found");

    const now = getNow(req);

    // expiry check
    if (paste.expiresAt && now > paste.expiresAt) {
      await prisma.paste.delete({ where: { slug: id } });
      return res.status(404).send("Expired");
    }

    // view limit check
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      await prisma.paste.delete({ where: { slug: id } });
      return res.status(404).send("View Limit Reached");
    }

    // increment viewcount
    await prisma.paste.update({
      where: { slug: id },
      data: { viewCount: { increment: 1 } }
    });

    // sanitize output
    const safe = paste.content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    res.status(200).send(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>Paste</title></head>
<body><pre>${safe}</pre></body>
</html>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
