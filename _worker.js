addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }

  const url = new URL(request.url)
  const path = url.pathname

  // POST /api/brevo/subscribe — Kontakt zur Liste hinzufügen
  if (path === '/api/brevo/subscribe' && request.method === 'POST') {
    try {
      const data = await request.json()
      const email = data.email
      const listId = 3
      const apiKey = BREVO_API_KEY

      if (!email) {
        return new Response(JSON.stringify({ error: 'Email required' }), {
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
        })
      }

      // Kontakt zu Brevo Liste hinzufügen
      const contactRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          listIds: [listId],
          updateEnabled: true
        })
      })

      // Willkommens-Email senden
      const welcomeHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#08090A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#08090A;"><tr><td align="center" style="padding:40px 20px;"><table width="560" cellpadding="0" cellspacing="0" style="background:#0C0D0E;border-radius:12px;border:1px solid rgba(255,255,255,0.06);"><tr><td style="padding:40px 32px;text-align:center;"><img src="https://cdn.ictrading.com/uploads/ICT_LOGOs/2026/ICTrading_BlackBG_400x110.png" alt="ICTrading" width="200" style="margin-bottom:24px;"><h1 style="color:#E8E9EA;font-size:24px;font-weight:700;margin:0 0 8px;letter-spacing:-0.02em;">Your ICTrading Starter Kit</h1><p style="color:#8B8D91;font-size:15px;line-height:1.6;margin:0 0 24px;">Thanks for signing up! Here's your free Starter Kit.</p><table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;"><tr><td align="center" style="background:#111213;border:1px solid rgba(255,255,255,0.10);border-radius:10px;padding:24px;"><p style="color:#E8E9EA;font-size:14px;font-weight:600;margin:0 0 12px;">ICTrading Starter Kit 2026</p><p style="color:#8B8D91;font-size:13px;margin:0 0 16px;">Platform Setup Guide · Risk Checklist · 3 Strategies</p><a href="https://vydas.net/ictrading-starter-kit-content.html" style="display:inline-block;background:#00d800;color:#08090A;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;text-decoration:none;">Download Your Kit</a></td></tr></table><p style="color:#5C5E62;font-size:13px;line-height:1.5;margin:0 0 20px;">Ready to start trading?</p><a href="https://www.ictrading.com?camp=89713" style="display:inline-block;background:transparent;color:#00d800;font-size:14px;font-weight:500;padding:12px 28px;border-radius:10px;border:1px solid rgba(255,255,255,0.10);text-decoration:none;">Open Your Free Account</a></td></tr><tr><td style="padding:20px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);"><p style="color:#5C5E62;font-size:11px;margin:0;"> 2026 vydas.net</p></td></tr></table></td></tr></table></body></html>`

      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'vydas', email: 'hello@vydas.net' },
          to: [{ email: email }],
          subject: 'Your ICTrading Starter Kit is ready!',
          htmlContent: welcomeHtml
        })
      })

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      })
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' }
      })
    }
  }

  // 404 für alles andere
  return new Response('Not found', { status: 404 })
}