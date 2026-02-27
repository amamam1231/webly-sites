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
    const stmt = context.env.DB.prepare('INSERT INTO leads (site_id, data, created_at) VALUES (?, ?, datetime("now"))');
    await stmt.bind(siteId, JSON.stringify(data)).run();
    
    // 2. Получаем настройки админки (Telegram Chat ID)
    const settingsStmt = context.env.DB.prepare('SELECT value FROM site_settings WHERE site_id = ? AND key = "telegram_chat_id" LIMIT 1');
    const settingsResult = await settingsStmt.bind(siteId).first();
    
    // 3. Отправляем в Telegram, если указан Chat ID
    if (settingsResult && settingsResult.value) {
      const chatId = settingsResult.value;
      const botToken = "8230811012:AAHQr38huG5hCX4_kq0edf4e_hLtGkDpdes"; // Токен нашего бота Webly AI
      
      let message = `🔔 <b>Новая заявка с сайта!</b>\n🌐 ${siteId}\n\n`;
      for (const [key, value] of Object.entries(data)) {
        if (key === 'telegram_chat_id') continue;
        message += `<b>${key}:</b> ${value}\n`;
      }
      
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });
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
