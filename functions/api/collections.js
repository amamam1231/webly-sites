export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const siteId = url.hostname;
    const collectionName = url.searchParams.get('name');
    
    if (!collectionName) {
      return new Response(JSON.stringify({ error: 'Collection name is required' }), { status: 400 });
    }
    
    // Пытаемся получить данные, если таблицы нет - не падаем, а возвращаем пустой массив
    try {
      const { results } = await context.env.DB.prepare(
        'SELECT id, data FROM collections WHERE site_id = ? AND collection_name = ? ORDER BY created_at DESC'
      ).bind(siteId, collectionName).all();
      
      const items = (results || []).map(row => {
        try {
          return { id: row.id, ...JSON.parse(row.data) };
        } catch(e) {
          return { id: row.id };
        }
      });
      
      return new Response(JSON.stringify(items), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (dbErr) {
      // Если таблица collections еще не создана (старые сайты)
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestPost(context) {
  try {
    const { action, collectionName, item } = await context.request.json();
    const url = new URL(context.request.url);
    const siteId = url.hostname;
    
    if (!collectionName || !action) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    
    // Создаем таблицу если ее нет (на случай если schema.sql не отработал)
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS collections (
        id TEXT,
        site_id TEXT,
        collection_name TEXT NOT NULL,
        data TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id, site_id)
      )
    `).run();
    
    if (action === 'delete' && item?.id) {
      await context.env.DB.prepare(
        'DELETE FROM collections WHERE id = ? AND site_id = ? AND collection_name = ?'
      ).bind(item.id, siteId, collectionName).run();
      
      return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' }});
    }
    
    if (action === 'save' && item) {
      const itemId = item.id || crypto.randomUUID();
      const itemData = { ...item };
      delete itemData.id; // Убираем ID из payload, он хранится в колонке
      
      await context.env.DB.prepare(
        `INSERT INTO collections (id, site_id, collection_name, data) 
         VALUES (?, ?, ?, ?) 
         ON CONFLICT(id, site_id) DO UPDATE SET data = excluded.data, updated_at = datetime("now")`
      ).bind(itemId, siteId, collectionName, JSON.stringify(itemData)).run();
      
      return new Response(JSON.stringify({ success: true, id: itemId }), { headers: { 'Content-Type': 'application/json' }});
    }
    
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
