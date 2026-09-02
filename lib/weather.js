export const GEO = 'https://api.openweathermap.org/geo/1.0'

export function toC(k) { return Math.round(k - 273.15) }
export function toF(k) { return Math.round((k - 273.15) * 9/5 + 32) }
export function convertTemp(k, unit) { return unit === 'C' ? toC(k) : toF(k) }

export function getWindDir(deg) {
  const d = ['N','NE','E','SE','S','SW','W','NW']
  return d[Math.round(deg / 45) % 8]
}

const mapWeather = {
  Clear: 'sunny',
  Clouds: 'cloudy',
  Rain: 'rain',
  Thunderstorm: 'thunder',
  Snow: 'snow',
  Mist: 'fog',
}

export function formatTime(ts, offset = 0) {
  const d = new Date((ts + offset) * 1000)
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`
}

export function getDayName(ts, offset = 0) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  return days[new Date((ts + offset) * 1000).getUTCDay()]
}

export function getWeatherIconKey(id, isDay = true) {
  if (id >= 200 && id < 300) return 'thunderstorm'
  if (id >= 300 && id < 400) return 'drizzle'
  if (id === 511) return 'sleet'
  if (id >= 500 && id < 600) return 'rain'
  if (id >= 600 && id < 700) return 'snow'
  if (id >= 700 && id < 800) return 'fog'
  if (id === 800) return isDay ? 'clear-day' : 'clear-night'
  if (id === 801) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night'
  if (id === 802) return 'cloudy'
  if (id >= 803) return 'overcast'
  return 'unknown'
}

export function getWeatherTheme(id, isDay) {
  if (id >= 200 && id < 300) return isDay 
    ? { type: 'thunder', bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)', accent: '#a78bfa' }
    : { type: 'thunder', bg: 'linear-gradient(160deg, #0f0f1c 0%, #0d1426 40%, #09213d 100%)', accent: '#8b5cf6' }
  if (id >= 300 && id < 600) return isDay 
    ? { type: 'rain',    bg: 'linear-gradient(160deg, #1e3a5f 0%, #2d5a8e 50%, #1a3a5c 100%)', accent: '#60a5fa' }
    : { type: 'rain',    bg: 'linear-gradient(160deg, #0d1f35 0%, #16304f 50%, #0f243b 100%)', accent: '#3b82f6' }
  if (id >= 600 && id < 700) return isDay 
    ? { type: 'snow',    bg: 'linear-gradient(160deg, #dde8f5 0%, #c9d8eb 50%, #b8cfe0 100%)', accent: '#3b82f6' }
    : { type: 'snow',    bg: 'linear-gradient(160deg, #1e293b 0%, #334155 50%, #475569 100%)', accent: '#94a3b8' }
  if (id >= 700 && id < 800) return isDay 
    ? { type: 'fog',     bg: 'linear-gradient(160deg, #6b7280 0%, #9ca3af 50%, #6b7280 100%)', accent: '#e5e7eb' }
    : { type: 'fog',     bg: 'linear-gradient(160deg, #374151 0%, #4b5563 50%, #374151 100%)', accent: '#9ca3af' }
  if (id === 800 && isDay)   return { type: 'sunny',   bg: 'linear-gradient(160deg, #0284c7 0%, #38bdf8 50%, #bae6fd 100%)', accent: '#fbbf24' }
  if (id === 800 && !isDay)  return { type: 'night',   bg: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', accent: '#818cf8' }
  return isDay 
    ? { type: 'cloudy',  bg: 'linear-gradient(160deg, #334155 0%, #475569 50%, #64748b 100%)', accent: '#94a3b8' }
    : { type: 'cloudy',  bg: 'linear-gradient(160deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)', accent: '#64748b' }
}

export const AQI_LABELS = ['','Good','Fair','Moderate','Poor','Very Poor']
export const AQI_COLORS = ['','#34d399','#a3e635','#fbbf24','#f97316','#ef4444']

export function getUVLabel(uv) {
  if (uv <= 2) return 'Low'
  if (uv <= 5) return 'Moderate'
  if (uv <= 7) return 'High'
  if (uv <= 10) return 'Very High'
  return 'Extreme'
}

// Calls internal Next.js API route — key stays on server
export async function fetchWeatherByCoords(lat, lon) {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`)
  const data = await res.json()
  if (!res.ok || data.error) throw new Error(data.error || 'Failed')
  return { ...data, lat, lon }
}

export async function searchCities(query) {
  const res = await fetch(`/api/weather?lat=0&lon=0&type=search&q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}