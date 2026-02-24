# Dental Care Prague - Deployment Guide

## Cloudflare Pages Setup

1. **Install Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **Create D1 Database**
   ```bash
   npx wrangler d1 create landing_db
   ```
   Copy the database_id from the output and update `wrangler.toml`.

4. **Execute Schema**
   ```bash
   npx wrangler d1 execute landing_db --file=./schema.sql
   ```

5. **Build and Deploy**
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

## Environment Variables

Set in Cloudflare Pages dashboard:
- `TELEGRAM_BOT_TOKEN` (optional, for lead notifications)

## Lead Notifications

To receive leads via Telegram:
1. Create a bot with @BotFather
2. Get your chat ID from @userinfobot
3. Set `telegram_chat_id` in the admin panel