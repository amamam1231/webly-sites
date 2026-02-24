export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { message, context: siteContext } = body

    // Here you can integrate with OpenAI, Claude, or other AI services
    // For now, return a fallback response
    const reply = `Спасибо за ваш вопрос! Для точного ответа рекомендую позвонить нам: +7 (999) 123-45-67 или записаться через форму на сайте.`

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}