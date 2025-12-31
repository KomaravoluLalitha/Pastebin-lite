//paste.route.js
import express from "express";
import {
  healthCheck,
  createPaste,
  getPasteApi,
  getPasteHtml
} from "../controllers/paste.controller.js";

const router = express.Router();

// Root route
router.get("/", (req, res) => res.send("Pastebin Lite API is running!"));

// Health check
router.get("/api/healthz", healthCheck);

// Create paste
router.post("/api/pastes", createPaste);

// Get paste (JSON)
router.get("/api/pastes/:id", getPasteApi);

// Get paste (HTML)
router.get("/p/:id", getPasteHtml);

export default router;
