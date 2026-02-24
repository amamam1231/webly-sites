# Sergio Musel Barbershop - Deployment Guide

## Cloudflare Pages Deployment

### 1. Initial Setup

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### 2. Create D1 Database

```bash
# Create new D1 database
npx wrangler d1 create landing_db

# Note the database_id from output and update wrangler.toml
```

### 3. Initialize Database Schema

```bash
# Execute schema.sql on your D1 database
npx wrangler d1 execute landing_db --file=./schema.sql

# Or for local development
npx wrangler d1 execute landing_db --local --file=./schema.sql
```

### 4. Deploy to Cloudflare Pages

```bash
# Deploy via Wrangler
npx wrangler pages deploy dist

# Or connect GitHub repository in Cloudflare Dashboard
# Build command: npm run build
# Build output: dist
```

### 5. Set Environment Secrets

```bash
# Set Web3Forms API key for contact form
npx wrangler secret put WEB3FORMS_KEY

# Set any other secrets needed
```

### 6. Admin Panel Access

After deployment, access admin panel at:
`https://your-domain.pages.dev/admin`

Default admin credentials should be configured in Cloudflare Access or via custom auth implementation.

### 7. API Endpoints

The following API endpoints are available via Cloudflare Functions:

- `POST /api/leads` - Save form submissions to D1
- `POST /api/chat` - AI chat fallback endpoint
- `GET /api/settings` - Get site settings from D1

### Development

```bash
# Local development with D1
npx wrangler pages dev --d1=landing_db

# Or standard Vite dev server (without D1)
npm run dev
```

### Important Notes

1. Update `database_id` in `wrangler.toml` after creating D1 database
2. Replace `YOUR_WEB3FORMS_ACCESS_KEY` in the code with your actual Web3Forms key
3. Configure custom domain in Cloudflare Pages dashboard if needed
4. Enable Cloudflare Analytics for traffic insights