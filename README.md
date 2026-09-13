# Dammar B.K. Portfolio

A premium, modern software engineer portfolio built with React on the frontend and Node.js/Express with MySQL-ready architecture on the backend.

## Project structure

```text
Dammar-Portfolio/
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   │   ├── your-image.jpg
│   │   │   ├── your-image.svg
│   │   ├── favicon.svg
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   └── Dammar-BK-CV.pdf
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   │   └── profile.js
│   │   ├── data/
│   │   │   ├── projects.js
│   │   │   ├── skills.js
│   │   │   ├── experience.js
│   │   │   ├── education.js
│   │   │   ├── certifications.js
│   │   │   ├── services.js
│   │   │   ├── collegeProjects.js
│   │   │   ├── websites.js
│   │   │   └── nationalProjects.js
│   │   ├── services/
│   │   │   └── contactService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── contactController.js
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── contactMessageModel.js
│   │   └── projectModel.js
│   ├── routes/
│   │   ├── contactRoutes.js
│   │   └── projectRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .env.example
├── README.md
└── package-lock.json
```

## Frontend commands

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
npm run build
npm run preview -- --host 0.0.0.0
```

## Backend commands

```bash
cd backend
npm install
cp .env.example .env
npm run dev
# or
npm start
```

## MySQL setup

1. Create a MySQL database named `dammar_portfolio`.
2. Import the schema file:

```bash
mysql -u root -p < backend/database/schema.sql
```

3. Update the `.env` file in the backend folder with your actual database values.

## Environment configuration

Root `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dammar_portfolio
PORT=5000
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

Backend `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dammar_portfolio
PORT=5000
CLIENT_URL=http://localhost:5173
```

## Replace YOUR IMAGE

Replace the placeholder image in:

```text
frontend/public/images/your-image.jpg
```

You can also replace the SVG fallback in:

```text
frontend/public/images/your-image.svg
```

The portfolio is already configured to fall back from the `.jpg` path to the `.svg` file if needed.

## Add a new project

Edit:

```text
frontend/src/data/projects.js
```

Add a new object in the array:

```js
{
  id: 7,
  title: 'Project Name',
  category: 'Full-Stack Projects',
  image: '/images/your-image.jpg',
  description: 'Short project description.',
  technologies: ['React.js', 'Node.js', 'MySQL'],
  github: '#',
  live: '#',
  featured: false,
}
```

## Replace CV

Replace the file at:

```text
frontend/public/Dammar-BK-CV.pdf
```

The portfolio already uses this file from the `profile.cv` config entry.

## Deployment
A complete, step-by-step hosting walkthrough lives in [`DEPLOYMENT.md`](./DEPLOYMENT.md).
The short version: host the frontend on **Vercel** (`frontend/vercel.json`) and the
backend on **Render** (`render.yaml`, which includes a `/api/health` health check),
with a free managed **MySQL** database; `backend/Dockerfile` covers Railway, Fly.io,
Cloud Run and VPS hosts.

### Frontend deployment
Use any static host such as Vercel, Netlify or GitHub Pages.

```bash
cd frontend
npm run build
```

Then publish the generated `dist` folder.

For Vercel or Netlify, set this environment variable before deploying:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend deployment

Deploy the backend to a Node.js host such as Render, Railway, DigitalOcean, or VPS. Ensure:

- `PORT` is set correctly
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` are configured in production environment variables
- CORS is set to your frontend domain

For Render or Railway, set these environment variables:

```env
DATABASE_URL=mysql://user:password@host:3306/database_name
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_CONNECTION_LIMIT=10
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
```

`CLIENT_URL` can contain multiple comma-separated frontend URLs when needed. Use either `DATABASE_URL` or the separate `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` and `DB_NAME` variables, not both.

## Connect MySQL

Update backend `.env` with your database credentials and ensure your MySQL server accepts connections. The app is built with `mysql2` and a pool-based configuration in `backend/config/db.js`.

## Production readiness

- Set real site metadata and Open Graph values in `frontend/index.html`
- Add a real CV PDF and profile image
- Replace placeholder contact information in `frontend/src/config/profile.js`
- Update social links and contact settings
- Configure production domains in CORS and deployment settings
- Add a real MySQL database and import schema once ready
- Add secure admin authentication later if needed
- Run `GET /api/health` after deployment to verify the backend is reachable
- Import `backend/database/schema.sql` into the hosted MySQL database before using the contact form
- Keep `.env` files private; only commit the provided `.env.example` templates
