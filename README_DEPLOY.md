# Dental Care Prague - Deployment Guide

## Cloudflare Pages Setup

1. **Create D1 Database:**
```bash
npx wrangler d1 create landing_db
```
Copy the database_id from the output and paste it into `wrangler.toml`.

2. **Initialize Database Schema:**
```bash
npx wrangler d1 execute landing_db --file=./schema.sql
```

3. **Deploy to Cloudflare Pages:**
- Connect your GitHub repository to Cloudflare Pages
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

4. **Environment Variables:**
Set these in Cloudflare Pages dashboard:
- `WEB3FORMS_KEY` - Your Web3Forms access key for contact forms

## Local Development

```bash
npm install
npm run dev
```

## API Endpoints (Cloudflare Functions)

The site expects these API endpoints:
- `GET /api/settings` - Returns site settings from D1
- `POST /api/leads` - Saves lead to D1 and sends Telegram notification

Create `functions/api/settings.js` and `functions/api/leads.js` for production use.