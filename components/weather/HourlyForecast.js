'use client'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Droplet } from 'lucide-react'
import { convertTemp, getWeatherIconKey, formatTime } from '@/lib/weather'
import WeatherIcon from '@/components/icons/WeatherIcon'

export default function HourlyForecast({ items, offset, unit, accent }) {
  const [visibleCount, setVisibleCount] = useState(5)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const scrollRef = useRef(null)

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
          const isSelected = i === selectedIndex
          return (
            <motion.div
              key={item.dt}
              onClick={() => setSelectedIndex(i)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                flex: '0 0 84px',
                background: isSelected ? `linear-gradient(180deg, ${accent}44, rgba(255,255,255,0.1))` : (isNow ? `linear-gradient(180deg, ${accent}22, rgba(255,255,255,0.05))` : 'rgba(255,255,255,0.08)'),
                border: `1px solid ${isSelected ? accent : (isNow ? accent + '60' : 'rgba(255,255,255,0.1)')}`,
                borderRadius: 20,
                padding: '16px 8px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                boxShadow: isSelected ? `0 8px 24px ${accent}40` : (isNow ? `0 8px 24px ${accent}20` : 'none'),
              }}
              whileHover={{ y: -4, background: isSelected ? `linear-gradient(180deg, ${accent}55, rgba(255,255,255,0.15))` : 'rgba(255,255,255,0.15)', borderColor: isSelected ? accent : 'rgba(255,255,255,0.2)' }}
            >
              {(isNow || isSelected) && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                  background: isSelected ? accent : `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }} />
              )}
              <div style={{ fontSize: 12, color: isNow ? accent : 'rgba(255,255,255,0.6)', marginBottom: 12, fontWeight: isNow ? 700 : 500 }}>
                {isNow ? 'NOW' : formatTime(item.dt, offset)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <WeatherIcon iconKey={getWeatherIconKey(item.weather[0].id, true)} size={32} />
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff' }}>
                {convertTemp(item.main.temp, unit)}°
              </div>
              {item.pop > 0.1 && (
                <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                  <Droplet size={11} /> {Math.round(item.pop * 100)}%
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Selected Hour Details */}
      {items[selectedIndex] && (() => {
        const selectedItem = items[selectedIndex];
        return (
          <motion.div
            key={selectedItem.dt}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: 16, marginTop: 4, marginBottom: 12, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <WeatherIcon iconKey={getWeatherIconKey(selectedItem.weather[0].id, true)} size={42} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', textTransform: 'capitalize' }}>
                    {selectedItem.weather[0].description}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                    {selectedIndex === 0 ? 'Now' : formatTime(selectedItem.dt, offset)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                  {convertTemp(selectedItem.main.temp, unit)}°
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                  Feels like {convertTemp(selectedItem.main.feels_like, unit)}°
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Wind</div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{Math.round(selectedItem.wind.speed * 3.6)} <span style={{ fontSize: 10 }}>km/h</span></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Humidity</div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{selectedItem.main.humidity}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Rain</div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{Math.round(selectedItem.pop * 100)}%</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Pressure</div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{selectedItem.main.pressure}</div>
              </div>
            </div>
          </motion.div>
        )
      })()}

      {/* Temperature Trend Chart */}
      {items.length > 1 && (
        <div style={{ marginTop: 28, position: 'relative' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
             <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} /> 24-Hour Trend
          </div>
          <div className="scroll-hide" style={{ overflowX: 'auto', paddingBottom: 12, paddingRight: 20 }}>
            <div style={{ height: 140, position: 'relative', minWidth: Math.max(100, items.length * 60) }}>
              {(() => {
                const temps = items.map(item => convertTemp(item.main.temp, unit));
                const minTemp = Math.min(...temps);
                const maxTemp = Math.max(...temps);
                const range = maxTemp - minTemp || 1;
                const paddingY = 30; // space for top/bottom text
                
                const points = temps.map((temp, i) => {
                  const x = 5 + (i / (items.length - 1)) * 90;
                  const y = 100 - paddingY - ((temp - minTemp) / range) * (100 - paddingY * 2);
                  return { x, y, temp, time: i === 0 ? 'Now' : formatTime(items[i].dt, offset) };
                });

                const smoothPath = (pts) => {
                  if (pts.length < 2) return '';
                  let d = `M ${pts[0].x},${pts[0].y}`;
                  for (let i = 0; i < pts.length - 1; i++) {
                    const curr = pts[i];
                    const next = pts[i + 1];
                    const midX = curr.x + (next.x - curr.x) / 2;
                    d += ` C ${midX},${curr.y} ${midX},${next.y} ${next.x},${next.y}`;
                  }
                  return d;
                };

                const curve = smoothPath(points);
                const area = `${curve} L ${points[points.length-1].x},100 L ${points[0].x},100 Z`;

                return (
                  <>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="chart-grad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={accent} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <path d={area} fill="url(#chart-grad)" />
                      <path d={curve} fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                    </svg>
                    
                    {/* HTML Overlay for Text and Dots to prevent stretch distortion */}
                    {points.map((pt, i) => (
                      <div key={i} style={{ position: 'absolute', left: `${pt.x}%`, top: `${pt.y}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', bottom: 14, fontSize: 14, fontWeight: 800, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.4)', fontFamily: "'Outfit', sans-serif" }}>
                          {pt.temp}°
                        </div>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', border: `2.5px solid ${accent}`, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
                        <div style={{ position: 'absolute', top: 16, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {pt.time}
                        </div>
                      </div>
                    ))}
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}