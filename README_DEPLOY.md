# Deployment Instructions

## Cloudflare D1 Database Setup

1. Create D1 database:
```bash
npx wrangler d1 create landing_db
```

2. Note the database ID from output and update `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "landing_db"
database_id = "your-actual-database-id"
```

3. Execute schema:
```bash
npx wrangler d1 execute landing_db --file=./schema.sql
```

4. Deploy to Cloudflare Pages:
```bash
npm run build
npx wrangler pages deploy dist
```

## Environment Variables

Set in Cloudflare Pages dashboard:
- `TELEGRAM_BOT_TOKEN` (if using Telegram notifications)

## Local Development

```bash
npm install
npm run dev