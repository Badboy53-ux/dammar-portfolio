# Hosting Guide — Dammar B.K. Portfolio

This project ships with a **React/Vite frontend** and an **Express + MySQL backend**.
The recommended free hosting setup is:

| Piece     | Host                | Why                                             |
| --------- | ------------------- | ----------------------------------------------- |
| Frontend  | **Vercel**          | Already linked (`.vercel/`), free, global CDN.  |
| Backend   | **Render**          | Free Node web service, health checks.           |
| Database  | **Aiven / Railway** | Free managed MySQL (Render has no free MySQL).  |

Config files already added to the repo:

- `frontend/vercel.json` — SPA routing + asset caching + security headers
- `render.yaml` — Render Blueprint for the backend
- `backend/Dockerfile` / `backend/.dockerignore` — for Railway, Fly.io, Cloud Run, VPS

---

## Step 1 — Create a hosted MySQL database

Pick one provider (they all give you a host, port, user, password, database name):

- **Aiven** (recommended free tier): <https://aiven.io> → Create service → MySQL → copy the connection info.
- **Railway**: <https://railway.app> → New Project → Add MySQL → Variables tab.

Then import the schema. From the project root, replacing the placeholders:

```powershell
mysql -h YOUR_DB_HOST -P YOUR_DB_PORT -u YOUR_DB_USER -p YOUR_DB_NAME < backend/database/schema.sql
```

Note the values — you need them in Step 2. Also make sure the database allows
connections from your backend host (Aiven: add `0.0.0.0/0` to allowed IPs, or use
the service's public endpoint). Managed MySQL almost always requires **SSL**.

---

## Step 2 — Deploy the backend (Render)

1. Push this repository to GitHub (see Step 4 if you haven't yet).
2. Go to <https://render.com> → **New +** → **Blueprint** → select this repo.
   Render reads `render.yaml` and creates `dammar-portfolio-backend` automatically.
3. When prompted, fill the secret environment variables:

   | Key             | Value                                              |
   | --------------- | -------------------------------------------------- |
   | `DB_HOST`       | your database host                                 |
   | `DB_PORT`       | `3306` (or the port your provider gave)            |
   | `DB_USER`       | your database user                                 |
   | `DB_PASSWORD`   | your database password                             |
   | `DB_NAME`       | your database name                                 |
   | `CLIENT_URL`    | your frontend URL, e.g. `https://your-app.vercel.app` |

   `DB_SSL=true` is already preset — keep it on for managed databases.
4. Deploy. When it finishes, open `https://<your-service>.onrender.com/api/health`.
   You should see `{"status":"ok", ...}`. **Copy that backend URL** — you need it next.

> Free Render services sleep after inactivity; the first request may take ~30s to wake.

---

## Step 3 — Deploy the frontend (Vercel)

The frontend is already linked to a Vercel project (`.vercel/project.json`).

1. Set the production API URL as a Vercel environment variable:

   ```powershell
   cd frontend
   npx vercel env add VITE_API_URL production
   # paste: https://<your-backend>.onrender.com/api
   ```

   (Or do it in the Vercel dashboard → Project → Settings → Environment Variables.)

2. Deploy to production:

   ```powershell
   cd frontend
   npx vercel --prod
   ```

   Vercel uses `vercel.json`: builds with `npm run build`, serves `dist/`,
   rewrites unknown paths to `index.html`, and caches `/assets/*` for a year.

3. Open the printed production URL and verify:
   - Hero, skills, projects and contact sections render.
   - The dashboard shows **"API sync active"** (means the backend was reached).
   - Submit the contact form; then check the `contact_messages` table.

Finally, go back to Render and confirm `CLIENT_URL` exactly matches this Vercel
domain (comma-separate multiple origins if you use both apex and `www`).

---

## Step 4 — Push the code (first time)

```powershell
cd "c:\Users\home\Desktop\Dammar-Portfolio"
git add .
git commit -m "Add hosting configuration and deployment guide"
git push origin main
```

The remote is `https://github.com/Badboy53-ux/dammar-portfolio.git`.
`.vercel/` and `.env` files are git-ignored, so no secrets are pushed.

---

## Alternative backend hosts

**Railway / Fly.io / Cloud Run / VPS** — use the included Dockerfile:

```powershell
cd backend
docker build -t dammar-portfolio-backend .
docker run -p 5000:5000 --env-file .env dammar-portfolio-backend
```

Set the same environment variables listed in Step 2 on the target platform.

**Single-service option** — instead of Render + Vercel, host the backend on a VPS
and serve the built `frontend/dist` with Nginx, or add static serving in
`backend/server.js`. The split setup above keeps each part free and independent.

---

## Environment variable reference

**Backend** (never commit the real file — `.env` is git-ignored):

```env
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=dammar_portfolio
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_CONNECTION_LIMIT=10
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
```

`DATABASE_URL` is supported instead of the individual `DB_*` values (use one, not both).

**Frontend** (set in Vercel, not committed):

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Post-deploy checklist

- [ ] `GET /api/health` returns `ok` on the backend URL.
- [ ] Frontend dashboard shows "API sync active".
- [ ] Contact form writes a row into `contact_messages`.
- [ ] `CLIENT_URL` matches the deployed frontend origin exactly.
- [ ] Custom domain configured in Vercel (Project → Domains) and in `CLIENT_URL`.
- [ ] Real values set in `frontend/src/config/profile.js` and `frontend/index.html`
      (contact details, `og:image`, CV file).
