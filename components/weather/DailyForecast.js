'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplet } from 'lucide-react'
import { convertTemp, getWeatherIconKey, getDayName, formatTime } from '@/lib/weather'
import WeatherIcon from '@/components/icons/WeatherIcon'

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
  const [expandedDay, setExpandedDay] = useState(null)
  const days = groupByDay(items, offset)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card"
      style={{ padding: '24px 24px 20px', marginBottom: 16 }}
    >
      <div className="section-label">5-Day Forecast</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {days.map((day, i) => {
          const temps = day.items.map(x => x.main.temp)
          const maxT = Math.max(...temps)
          const minT = Math.min(...temps)
          const iconKey = getWeatherIconKey(day.items[0].weather[0].id, true)
          const desc = day.items[0].weather[0].description
          const pop = Math.round((day.items[0].pop || 0) * 100)

          return (
            <motion.div
              key={day.name}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              onClick={() => setExpandedDay(expandedDay === day.name ? null : day.name)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              whileHover={{ background: 'rgba(255,255,255,0.12)', x: 6, borderColor: 'rgba(255,255,255,0.15)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '16px 18px', gap: 16 }}>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 15, fontWeight: 700,
                  color: i === 0 ? accent : '#fff',
                  width: 52, flexShrink: 0,
                }}>
                  {i === 0 ? 'Today' : day.name}
                </div>

                <div style={{ flexShrink: 0, width: 40, display: 'flex', justifyContent: 'center' }}>
                  <WeatherIcon iconKey={iconKey} size={28} />
                </div>

                <div style={{
                  flex: 1, fontSize: 14, color: 'rgba(255,255,255,0.65)',
                  textTransform: 'capitalize', overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}>
                  {desc}
                </div>

                {pop > 10 && (
                  <div style={{ fontSize: 13, color: '#60a5fa', fontWeight: 700, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Droplet size={13} /> {pop}%
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0, width: 80, justifyContent: 'flex-end' }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#fbbf24' }}>
                    {convertTemp(maxT, unit)}°
                  </span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                    {convertTemp(minT, unit)}°
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {expandedDay === day.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="scroll-hide" style={{ display: 'flex', gap: 8, padding: '0 18px 16px', overflowX: 'auto', background: 'rgba(0,0,0,0.1)' }}>
                      {day.items.map((item, j) => (
                        <div key={item.dt} style={{ flexShrink: 0, textAlign: 'center', width: 60, padding: '8px 0' }}>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 600 }}>
                            {formatTime(item.dt, offset)}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                            <WeatherIcon iconKey={getWeatherIconKey(item.weather[0].id, true)} size={22} />
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                            {convertTemp(item.main.temp, unit)}°
                          </div>
                          {item.pop > 0.1 && (
                            <div style={{ fontSize: 10, color: '#60a5fa', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                              <Droplet size={10} /> {Math.round(item.pop * 100)}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}