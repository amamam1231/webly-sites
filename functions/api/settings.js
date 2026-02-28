export async function onRequestGet(context) {
  const { env } = context

  try {
    const result = await env.DB.prepare(
      "SELECT key, value FROM settings"
    ).all()

    const settings = {}
    result.results.forEach(row => {
      try {
        settings[row.key] = JSON.parse(row.value)
      } catch {
        settings[row.key] = row.value
      }
    })

    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({}), {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}