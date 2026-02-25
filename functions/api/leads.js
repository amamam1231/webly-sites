export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // 1. Сохраняем в D1
    const stmt = context.env.DB.prepare('INSERT INTO leads (data, created_at) VALUES (?, datetime("now"))');
    await stmt.bind(JSON.stringify(data)).run();
    
    // 2. Получаем настройки админки (Telegram Chat ID)
    const settingsStmt = context.env.DB.prepare('SELECT value FROM site_settings WHERE key = "telegram_chat_id" LIMIT 1');
    const settingsResult = await settingsStmt.first();
    
    // 3. Отправляем в Telegram, если указан Chat ID
    if (settingsResult && settingsResult.value) {
      const chatId = settingsResult.value;
      const botToken = "8230811012:AAHQr38huG5hCX4_kq0edf4e_hLtGkDpdes"; // Токен нашего бота Webly AI
      
      let message = "🔔 <b>Новая заявка с сайта!</b>\n\n";
      for (const [key, value] of Object.entries(data)) {
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
