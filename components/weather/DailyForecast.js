'use client'
import { motion } from 'framer-motion'
import { convertTemp, getWeatherIcon, getDayName } from '@/lib/weather'

function groupByDay(items, offset) {
  const map = new Map()
  items.forEach(item => {
    const key = getDayName(item.dt, offset)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  })
  return Array.from(map.entries()).slice(0, 5).map(([name, items]) => ({ name, items }))
}

export default function DailyForecast({ items, offset, unit, accent }) {
  const days = groupByDay(items, offset)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card"
      style={{ padding: '22px 22px 16px', marginBottom: 14 }}
    >
      <div className="section-label">5-Day Forecast</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {days.map((day, i) => {
          const temps = day.items.map(x => x.main.temp)
          const maxT = Math.max(...temps)
          const minT = Math.min(...temps)
          const icon = getWeatherIcon(day.items[0].weather[0].id, true)
          const desc = day.items[0].weather[0].description
          const pop = Math.round((day.items[0].pop || 0) * 100)

          return (
            <motion.div
              key={day.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '13px 14px',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.25s',
                cursor: 'default',
                gap: 12,
              }}
              whileHover={{ background: 'rgba(255,255,255,0.09)', x: 4 }}
            >
              {/* Day name */}
              <div style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14, fontWeight: 600,
                color: i === 0 ? accent : '#fff',
                width: 48, flexShrink: 0,
              }}>
                {i === 0 ? 'Today' : day.name}
              </div>

              {/* Icon */}
              <div style={{ fontSize: 24, flexShrink: 0, width: 36, textAlign: 'center' }}>{icon}</div>

              {/* Description */}
              <div style={{
                flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.45)',
                textTransform: 'capitalize', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {desc}
              </div>

              {/* Rain chance */}
              {pop > 10 && (
                <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 600, flexShrink: 0 }}>
                  💧{pop}%
                </div>
              )}

              {/* Temp range */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: '#fbbf24' }}>
                  {convertTemp(maxT, unit)}°
                </span>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
                  {convertTemp(minT, unit)}°
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
