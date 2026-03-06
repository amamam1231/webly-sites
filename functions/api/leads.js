export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const siteId = url.hostname; // e.g., site-375.webly-sites.pages.dev
    
    const { results } = await context.env.DB.prepare('SELECT * FROM leads WHERE site_id = ? ORDER BY created_at DESC LIMIT 50').bind(siteId).all();
    return new Response(JSON.stringify(results || []), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const url = new URL(context.request.url);
    const siteId = url.hostname;
    
    // 1. Сохраняем в D1 с привязкой к site_id
    try {
      const stmt = context.env.DB.prepare('INSERT INTO leads (site_id, data, created_at) VALUES (?, ?, datetime("now"))');
      await stmt.bind(siteId, JSON.stringify(data)).run();
    } catch (dbErr) {
      console.error("D1 Insert Error:", dbErr);
    }
    
    // 2. Отправляем уведомление в Telegram бота владельцу
    // БЕЗОПАСНОСТЬ: Токен берется строго из переменных окружения Cloudflare (НЕ хардкодим в коде!)
    const botToken = context.env.TELEGRAM_BOT_TOKEN;
    const chatId = "347995964";
    
    if (botToken && chatId) {
      let messageText = `🔔 <b>Новая заявка с вашего сайта!</b>\n🌐 Домен: <code>${siteId}</code>\n\n`;
      
      // Исключаем системные поля, если они есть
      const skipFields = ['siteId', 'form_type'];
      for (const [key, value] of Object.entries(data)) {
        if (!skipFields.includes(key)) {
           // Форматируем ключи для красоты (например, first_name -> First Name)
           const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
           messageText += `<b>${cleanKey}</b>: ${value}\n`;
        }
      }
      
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
            parse_mode: 'HTML'
          })
        });
      } catch (tgErr) {
        console.error("Telegram Send Error:", tgErr);
      }
    } else if (!botToken) {
       console.error("TELEGRAM_BOT_TOKEN is not set in Cloudflare Pages environment variables.");
    }
    
    return new Response(JSON.stringify({ success: true, message: "Lead saved successfully" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
