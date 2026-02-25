export async function onRequestPost(context) {
  const { env, request } = context

  try {
    const data = await request.json()

    // Save to D1
    await env.DB.prepare(
      "INSERT INTO leads (name, email, phone, service, message, source) VALUES (?, ?, ?, ?, ?, ?)"
    ).bind(data.name, data.email, data.phone, data.service, data.message, 'website').run()

    // Send Telegram notification if configured
    if (env.TELEGRAM_BOT_TOKEN && data.telegram_chat_id) {
      const text = `New Lead!\nName: ${data.name}\nPhone: ${data.phone}\nService: ${data.service}`
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: data.telegram_chat_id,
          text: text
        })
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}