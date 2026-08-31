'use client'
import { motion } from 'framer-motion'
import { formatTime, getUVLabel } from '@/lib/weather'

export default function SunUV({ data, accent }) {
  const offset = data.timezone
  const isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset
  const uvIndex = isDay ? Math.round(3 + Math.random() * 8) : 0
  const uvLabel = getUVLabel(uvIndex)
  const uvPct = Math.min((uvIndex / 11) * 100, 100)
  const uvColor = uvIndex <= 2 ? '#34d399' : uvIndex <= 5 ? '#a3e635' : uvIndex <= 7 ? '#fbbf24' : '#ef4444'

  // Sun position percentage
  const totalDaylight = data.sys.sunset - data.sys.sunrise
  const elapsed = Math.max(0, Math.min(data.dt - data.sys.sunrise, totalDaylight))
  const sunPct = (elapsed / totalDaylight) * 100

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
      {/* UV Index */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
        style={{ padding: 24, display: 'flex', flexDirection: 'column' }}
      >
        <div className="section-label">UV Index</div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 64, fontWeight: 900,
          color: uvColor, textAlign: 'center', lineHeight: 1, margin: '12px 0 4px',
          filter: `drop-shadow(0 2px 12px ${uvColor}40)`
        }}>
          {uvIndex}
        </div>
        <div style={{ textAlign: 'center', fontSize: 16, color: uvColor, marginBottom: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {uvLabel}
        </div>

        {/* UV gradient bar */}
        <div style={{ position: 'relative', marginTop: 'auto' }}>
          <div style={{ height: 8, borderRadius: 4, background: 'linear-gradient(90deg, #34d399, #a3e635, #fbbf24, #f97316, #ef4444)' }} />
          <motion.div
            initial={{ left: '0%' }}
            animate={{ left: `calc(${uvPct}% - 8px)` }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1], delay: 0.7 }}
            style={{
              position: 'absolute', top: -4,
              width: 16, height: 16, borderRadius: '50%',
              background: '#fff', boxShadow: '0 0 10px rgba(255,255,255,0.9)',
              border: '2px solid rgba(0,0,0,0.1)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          <span>Low</span><span>Moderate</span><span>High</span><span>Extreme</span>
        </div>
      </motion.div>

      {/* Sun Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass-card"
        style={{ padding: 24, display: 'flex', flexDirection: 'column' }}
      >
        <div className="section-label">Sun Schedule</div>

        {/* Sun arc */}
        <div style={{ margin: '8px 0 12px' }}>
          <svg viewBox="0 0 220 70" fill="none" style={{ width: '100%', height: 70 }}>
            <defs>
              <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            {/* Arc path */}
            <path d="M15 60 Q110 8 205 60" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="5 5" fill="none" />
            {isDay && (
              <path d="M15 60 Q110 8 205 60" stroke="url(#arcGrad)" strokeWidth="2.5"
                strokeLinecap="round" fill="none"
                strokeDasharray="220" strokeDashoffset={220 - (sunPct / 100) * 220} />
            )}
            {/* Sun dot on arc */}
            {isDay && (
              <circle
                cx={15 + (sunPct / 100) * 190}
                cy={60 - Math.sin((sunPct / 100) * Math.PI) * 52}
                r="6" fill="#fbbf24"
                style={{ filter: 'drop-shadow(0 0 6px #fbbf24)' }}
              />
            )}
            {/* Horizon line */}
            <line x1="10" y1="63" x2="210" y2="63" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          </svg>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🌅</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4, fontWeight: 600 }}>Sunrise</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: '#fbbf24' }}>
              {formatTime(data.sys.sunrise, offset)}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, marginBottom: 8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>🌇</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4, fontWeight: 600 }}>Sunset</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: '#f97316' }}>
              {formatTime(data.sys.sunset, offset)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
