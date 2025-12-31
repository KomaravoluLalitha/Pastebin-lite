---

# Pastebin-Lite — Minimal Paste Sharing API

Pastebin-Lite is a lightweight backend service where users can create and share text snippets (“pastes”).
Each paste can have

* Expiry time (TTL in seconds)
* View-count limit
* Shareable link

Built with:

* Node.js + Express
* Prisma ORM
* PostgreSQL (NeonDB or local DB)

---

## 🚀 Features

* Create a paste with content, TTL, and max-views
* Fetch paste by slug
* Auto-delete expired or over-viewed pastes
* JSON-based REST API
* Works with Postman / Thunder Client

---

## 🛠 Project Setup

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env` file:

```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
PORT=3000
```

---

## 🗄 Prisma setup

Generate client & sync schema:

```bash
npx prisma generate
npx prisma db push
```

(Optional) open DB in Prisma Studio:

```bash
npx prisma studio
```

---

## ▶ Start Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## 📌 API Endpoints

### Create Paste

**POST** `/api/pastes`

Body:

```json
{
  "content": "Hello world!",
  "ttl_seconds": 60,
  "max_views": 5
}
```

Response:

```json
{
  "id": "xYz12A",
  "url": "http://localhost:3000/p/xYz12A"
}
```

---

### Get Paste by Slug

**GET** `/api/pastes/:slug`

Example:

```
http://localhost:3000/api/pastes/xYz12A
```

Returns:

```json
{
  "content": "Hello world!",
  "remaining_views": 4
}
```

Paste is deleted if:

* TTL expired
* Max views reached

---

## 🧹 Auto-Cleanup Rules

A paste is deleted when:

| Condition         | Meaning                  |
| ----------------- | ------------------------ |
| TTL expired       | current time > expiresAt |
| Max views reached | viewCount ≥ maxViews     |

---

## 📦 Prisma Model (reference)

```prisma
model Paste {
  id          String   @id @default(cuid())
  content     String
  slug        String   @unique
  expiresAt   DateTime?
  maxViews    Int?
  viewCount   Int      @default(0)
  createdAt   DateTime @default(now())
}
```

---

## 🧪 Testing in Postman

### Step-1 → Create Paste

* Method → POST
* URL → `http://localhost:3000/api/pastes`
* Body → raw → JSON

```json
{
  "content": "Sample paste text",
  "ttl_seconds": 120,
  "max_views": 3
}
```

Click **Send**

You will receive a URL like:

```
http://localhost:3000/p/abc123
```

---

### Step-2 → Fetch Paste

* Method → GET
* URL:

```
http://localhost:3000/api/pastes/abc123
```

Each view reduces `remaining_views`.

---

## ⚠ Common Issues

| Error                     | Reason                              |
| ------------------------- | ----------------------------------- |
| Cannot GET /              | Root route not defined              |
| Cannot GET /api/pastes    | Used GET instead of POST for create |
| Prisma schema not found   | schema.prisma missing / wrong path  |
| Database connection error | Wrong `DATABASE_URL`                |

---

## 📌 Roadmap (Future Enhancements)

* Password-protected pastes
* Front-end UI
* Admin dashboard
* Scheduled cleanup job

---

## 👩‍💻 Author

**K Naga Lalitha Sri**
Pastebin-Lite backend — built for learning & practice.

---

