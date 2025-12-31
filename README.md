# Pastebin Lite — Node.js + Express + Prisma + Postgres (Neon)

A minimal Pastebin-like service that supports:

- Create a paste
- Shareable URL `/p/:id`
- Optional expiry by time (TTL)
- Optional expiry by view count
- Paste becomes unavailable when a constraint is triggered

## 🗄 Persistence Layer

PostgreSQL (Neon) using Prisma ORM.

## ▶️ Run Locally

```bash
npm install
npx prisma db push
npm run dev
```

Create `.env` in project root:

```
DATABASE_URL="postgresql://<user>:<password>@<neon-host>/<db>?sslmode=require"
PORT=3000
BASE_URL=http://localhost:3000
```

---

## 📌 API Routes

### Health
GET `/api/healthz`

### Create Paste
POST `/api/pastes`

### Fetch Paste (API)
GET `/api/pastes/:id`

### View Paste (HTML)
GET `/p/:id`
