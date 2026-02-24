export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // Insert into database
    const stmt = env.DB.prepare(
      'INSERT INTO leads (name, phone, email, service, message) VALUES (?, ?, ?, ?, ?)'
    );
    await stmt.bind(data.name, data.phone, data.email || '', data.service || '', data.message || '').run();

    // Send Telegram notification if configured
    const settings = await env.DB.prepare('SELECT value FROM site_settings WHERE key = ?').bind('telegram_chat_id').first();

    if (settings?.value) {
      const botToken = env.TELEGRAM_BOT_TOKEN;
      if (botToken) {
        const text = `🔔 Nový lead!\n\n👤 ${data.name}\n📱 ${data.phone}\n📧 ${data.email || '-'}\n💼 ${data.service || '-'}\n💬 ${data.message || '-'}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: settings.value,
            text: text
          })
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}