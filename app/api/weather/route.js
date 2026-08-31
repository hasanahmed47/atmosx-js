const API_KEY = process.env.OWM_KEY // server-side only, never exposed to browser
const BASE = 'https://api.openweathermap.org/data/2.5'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const type = searchParams.get('type') || 'all'

  if (!lat || !lon) {
    return Response.json({ error: 'lat and lon required' }, { status: 400 })
  }

  if (!API_KEY) {
    return Response.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    if (type === 'search') {
      const q = searchParams.get('q')
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`
      )
      const data = await res.json()
      return Response.json(data)
    }

    const [current, forecast, air] = await Promise.all([
      fetch(`${BASE}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`).then(r => r.json()),
      fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&cnt=40`).then(r => r.json()),
      fetch(`${BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`).then(r => r.json()),
    ])

    if (current.cod === 401 || forecast.cod === '401') {
      return Response.json({ error: 'Invalid API key' }, { status: 401 })
    }

    return Response.json({ current, forecast, air })
  } catch (e) {
    return Response.json({ error: 'Failed to fetch weather' }, { status: 500 })
  }
}
