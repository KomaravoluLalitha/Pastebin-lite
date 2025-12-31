---

##  Pastebin-Lite — Minimal Paste Sharing API

Pastebin-Lite is a lightweight backend service where users can create and share text snippets (“pastes”).
Each paste can have:

*  Expiry time (TTL in seconds)
*  View-count limit
*  Shareable link

Built with:

* Node.js + Express
* Prisma ORM
* PostgreSQL (NeonDB or local DB)

---

##  Features

* Create a paste with content, TTL, and max-views
* Fetch paste by slug
* Auto-delete expired or over-viewed pastes
* JSON-based REST API
* Works with Postman / Thunder Client

---

##  Project Setup

### Install dependencies

```bash
npm install
```

---

###  Environment variables

Create a `.env` file:

```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
PORT=3000
```

---

### Prisma setup

Generate client & sync schema:

```bash
npx prisma generate
npx prisma db push
```

(Optional) View DB in Prisma Studio:

```bash
npx prisma studio
```

---

###  Start Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

##  API Endpoints

###  Create Paste

**POST** `/api/pastes`

Body (JSON):

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
  "url": "http://localhost:3000/p/xYz12A",
  "expires_in": 60,
  "max_views": 5
}
```

---

###  Get Paste By Slug

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

Paste will be deleted if:

* TTL expired
* Max views reached

---

###  Auto-Cleanup Rules

A paste is deleted when:

| Condition          | Meaning                              |
| ------------------ | ------------------------------------ |
| TTL expired        | Current time > created + ttl_seconds |
| Max views exceeded | views ≥ max_views                    |

---

##  Prisma Model (reference)

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

##  Testing in Postman

#### Step-1 → Create a new HTTP Request

* Method → **POST**
* URL → `http://localhost:3000/api/pastes`
* Body → raw → JSON

Paste JSON:

```json
{
  "content": "Sample paste text",
  "ttl_seconds": 120,
  "max_views": 3
}
```

Click **Send**

You will receive a paste URL like:

```
http://localhost:3000/p/abc123
```

---

#### Step-2 → Fetch paste

* Method → **GET**
* URL →

```
http://localhost:3000/api/pastes/abc123
```

Each view reduces `remaining_views`

---

##  Common Issues

| Error                       | Reason                              |
| --------------------------- | ----------------------------------- |
| `Cannot GET /`              | No route defined for root endpoint  |
| `Cannot GET /api/pastes`    | You are calling GET instead of POST |
| `Prisma schema not found`   | schema.prisma path missing          |
| `database connection error` | Wrong DATABASE_URL                  |

---

##  Roadmap / Possible Enhancements

*  Password-protected pastes
*  Front-end UI
*  Scheduled cleanup job
* Dashboard for paste stats

---

##  Author
K Naga Lalitha Sri 
Pastebin-Lite backend — built for learning & practice purpose only.
---