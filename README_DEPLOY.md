# Sergio Musel Barbershop - Deployment Guide

## Cloudflare Pages Deployment with D1 Database

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI installed globally

### Step 1: Install Wrangler
```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare
```bash
npx wrangler login
```

### Step 3: Create D1 Database
```bash
npx wrangler d1 create landing_db
```

**Important:** Copy the database ID from the output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "landing_db"
database_id = "your-actual-database-id-here"
```

### Step 4: Initialize Database Schema
```bash
npx wrangler d1 execute landing_db --file=./schema.sql
```

### Step 5: Set Environment Variables
```bash
npx wrangler secret put WEB3FORMS_ACCESS_KEY
# Enter your Web3Forms access key when prompted
```

Get your Web3Forms access key from: https://web3forms.com/

### Step 6: Build and Deploy
```bash
npm install
npm run build
npx wrangler pages deploy dist
```

### Local Development
```bash
npm install
npm run dev
```

For local D1 development:
```bash
npx wrangler pages dev dist --d1=DB
```

### Admin Panel Access
After deployment, access your admin panel at:
```
https://your-domain.pages.dev/admin
```

Default admin credentials are configured in your Cloudflare Dashboard under Environment Variables.

### Troubleshooting

**Database connection issues:**
- Verify database_id in wrangler.toml matches the created database
- Ensure D1 binding name is "DB" in wrangler.toml

**Form submission not working:**
- Verify WEB3FORMS_ACCESS_KEY is set in Cloudflare secrets
- Check browser console for API errors

**Map not displaying:**
- MapLibre GL JS requires WebGL support
- Check browser compatibility

### Support
For issues with deployment, contact support or check Cloudflare documentation:
https://developers.cloudflare.com/pages/