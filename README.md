# Ethixweb India — Full Stack Developer Assessment

A responsive India-focused redesign concept for Ethixweb, built with React + Vite, plain CSS, Node.js/Express, and MongoDB.

## Features
- Home, Services, About, Contact pages with a consistent visual system.
- Responsive navigation and mobile layout.
- Working enquiry form with client/server validation.
- MongoDB persistence for enquiries.
- Honeypot field + rate limiting for basic spam protection.
- Protected `/admin` dashboard with JWT login; view, search, update lead status, and delete leads.
- Secrets are environment variables; no credentials are committed.
- Accessible labels, reduced-motion support, semantic structure, loading/error states.

## Stack
- Frontend: React, Vite, React Router, Lucide React
- Backend: Express, Mongoose, bcryptjs, jsonwebtoken, Helmet, express-rate-limit
- Database: MongoDB Atlas or local MongoDB

## Run locally

### 1. Prerequisites
Node.js 20+ and MongoDB (local or Atlas).

### 2. Backend
```bash
cd server
cp .env.example .env
# Edit .env and set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run dev
```
API runs at `http://localhost:5000`.

### 3. Frontend
In another terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

The frontend's `VITE_API_URL` should be `http://localhost:5000/api` for local development.

## Admin login
Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`. Open `/admin` and sign in with those values. The dashboard is protected by a short-lived JWT. Use a strong password and long random `JWT_SECRET` in production.

## API
- `GET /api/health` — health check
- `POST /api/enquiries` — submit an enquiry
- `POST /api/admin/login` — admin login
- `GET /api/admin/enquiries` — list leads (auth required)
- `PATCH /api/admin/enquiries/:id` — update lead status (auth required)
- `DELETE /api/admin/enquiries/:id` — delete lead (auth required)

## Deployment
### Backend (Render / Railway)
- Set Root Directory to `server`.
- Build command: `npm install`
- Start command: `npm start`
- Add `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_ORIGIN` environment variables.
- `CLIENT_ORIGIN` should be the deployed frontend URL, e.g. `https://your-site.vercel.app`.

### Frontend (Vercel / Netlify)
- Set Root Directory to `client`.
- Add `VITE_API_URL=https://your-backend-domain/api`.
- Build command: `npm run build`; output directory: `dist`.

## PageSpeed and polish checklist
PageSpeed 90+ is a target, not a guaranteed result. Test the deployed URL using PageSpeed Insights. This project uses plain CSS, minimal dependencies, no large image assets, responsive layouts, and reduced-motion handling to help performance. Avoid adding large libraries or unoptimized images.

## Design rationale
- **India-specific without clichés:** the story centers on India's growing digital economy, founder-led businesses, regional ambition, and trust. Warm ivory, deep ink, and restrained vermilion create a premium editorial identity without relying on flag graphics.
- **Local relevance:** copy speaks to Indian businesses, growth-stage teams, service businesses, and conversion-focused digital experiences.
- **Premium presentation:** oversized typography, generous whitespace, editorial cards, clear hierarchy, and small motion details make the site feel contemporary and confident.
- **Improvement over a generic agency template:** clearer service outcomes, a visible process, direct calls to action, meaningful proof-point placeholders rather than fabricated client logos or testimonials, and an enquiry flow connected to a real database.
- **Honesty:** portfolio examples are presented as capabilities / sample directions, not claimed client work. Replace them with verified case studies before production.

## Security notes
- Never commit `.env`.
- Use a strong, unique admin password and JWT secret.
- Add HTTPS, backups, and monitoring in production.
- For higher-risk production use, add CAPTCHA/Turnstile, email verification, audit logs, and stronger admin account management.
