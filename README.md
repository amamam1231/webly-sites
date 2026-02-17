# webly-sites

Репозиторий для хостинга пользовательских сайтов через Cloudflare Pages.

## Архитектура

- **Один репозиторий** для всех сайтов
- **Каждый сайт** = отдельная ветка `site-{id}`
- **Cloudflare Pages** автоматически билдит все ветки

## Ветки

| Ветка | Назначение | URL |
|-------|------------|-----|
| `main` | Основная ветка (пустая) | https://webly-sites.pages.dev |
| `site-123` | Сайт пользователя #123 | https://site-123.webly-sites.pages.dev |
| `site-456` | Сайт пользователя #456 | https://site-456.webly-sites.pages.dev |

## Технологии

- React 18
- Vite 5
- Tailwind CSS 3
- Lucide React (иконки)

## Cloudflare Pages

Настройки билда:
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Branch deployments:** All branches

## Автоматизация

Ветки создаются автоматически через GitHub API ботом `webly-ai-bot`.

---

⚠️ **Не редактируйте ветки вручную** — они управляются ботом автоматически.
