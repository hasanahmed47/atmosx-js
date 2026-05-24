'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { convertTemp, getWeatherIcon, formatTime } from '@/lib/weather'

export default function HourlyForecast({ items, offset, unit, accent }) {
  const [visibleCount, setVisibleCount] = useState(5)
  const scrollRef = useRef(null)

  // Lazy load more on scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 60) {
        setVisibleCount(v => Math.min(v + 3, items.length))
      }
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [items.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card"
      style={{ padding: '22px 22px 16px', marginBottom: 14 }}
    >
      <div className="section-label">Hourly Forecast</div>

      <div ref={scrollRef} className="scroll-hide"
        style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}
      >
        {items.slice(0, visibleCount).map((item, i) => {
          const isNow = i === 0
          return (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                flex: '0 0 78px',
                background: isNow ? `${accent}22` : 'rgba(255,255,255,0.06)',
                border: `1px solid ${isNow ? accent + '60' : 'rgba(255,255,255,0.09)'}`,
                borderRadius: 16,
                padding: '14px 8px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              whileHover={{ y: -4, background: 'rgba(255,255,255,0.12)' }}
            >
              {isNow && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }} />
              )}
              <div style={{ fontSize: 11, color: isNow ? accent : 'rgba(255,255,255,0.45)', marginBottom: 8, fontWeight: isNow ? 600 : 400 }}>
                {isNow ? 'NOW' : formatTime(item.dt, offset)}
              </div>
              <div style={{ fontSize: 26, marginBottom: 8 }}>
                {getWeatherIcon(item.weather[0].id, true)}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff' }}>
                {convertTemp(item.main.temp, unit)}°
              </div>
              {item.pop > 0.1 && (
                <div style={{ fontSize: 10, color: '#60a5fa', marginTop: 5, fontWeight: 500 }}>
                  💧 {Math.round(item.pop * 100)}%
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
