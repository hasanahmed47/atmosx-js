'use client'
import { motion } from 'framer-motion'
import { convertTemp, getWeatherIcon, getFlagEmoji, getWindDir } from '@/lib/weather'

export default function MainWeatherCard({ data, unit, theme }) {
  const isDay = data.dt > data.sys.sunrise && data.dt < data.sys.sunset
  const icon = getWeatherIcon(data.weather[0].id, isDay)
  const sym = `°${unit}`
  const accent = theme?.accent || '#60a5fa'

  const stats = [
    { label: 'Humidity',   value: data.main.humidity,                      unit: '%',    icon: '💧' },
    { label: 'Wind',       value: Math.round(data.wind.speed * 3.6),        unit: `km/h`, icon: '💨', sub: getWindDir(data.wind.deg || 0) },
    { label: 'Pressure',   value: data.main.pressure,                       unit: 'hPa',  icon: '📊' },
    { label: 'Visibility', value: Math.round((data.visibility || 0) / 1000), unit: 'km',   icon: '👁️' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card"
      style={{ padding: '28px 28px 24px', marginBottom: 14, position: 'relative', overflow: 'hidden' }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        opacity: 0.8,
      }} />

      {/* Location + Icon row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: accent, boxShadow: `0 0 12px ${accent}`,
              animation: 'pulseDot 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600 }}>
              LIVE WEATHER
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(32px, 5vw, 42px)',
            fontWeight: 800,
            letterSpacing: -1,
            lineHeight: 1.1,
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            {data.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500 }}>
            {getFlagEmoji(data.sys.country)} {data.sys.country}
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ textTransform: 'capitalize' }}>{data.weather[0].description}</span>
          </div>
        </div>

        {/* Floating icon */}
        <div style={{ position: 'relative', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `1px solid ${accent}30`,
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 10, borderRadius: '50%',
              border: `1px dashed ${accent}20`,
            }}
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: 56, filter: `drop-shadow(0 0 20px ${accent}60)` }}
          >
            {icon}
          </motion.div>
        </div>
      </div>

      {/* Temperature */}
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
        <motion.div
          key={`${unit}-${data.main.temp}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(80px, 12vw, 110px)',
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 0.9,
            background: `linear-gradient(135deg, #ffffff 30%, ${accent})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))'
          }}
        >
          {convertTemp(data.main.temp, unit)}{sym}
        </motion.div>

        <div style={{ paddingBottom: 12 }}>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 8, fontWeight: 500 }}>
            Feels like {convertTemp(data.main.feels_like, unit)}{sym}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '4px 12px', fontSize: 14, color: '#fbbf24', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>
              ↑ {convertTemp(data.main.temp_max, unit)}{sym}
            </span>
            <span style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 10, padding: '4px 12px', fontSize: 14, color: accent, fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)' }}>
              ↓ {convertTemp(data.main.temp_min, unit)}{sym}
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '20px 0' }} />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 16,
              padding: '16px 14px',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
            whileHover={{ background: 'rgba(255,255,255,0.15)', y: -4, borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <div style={{ fontSize: 24, marginBottom: 12, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>{s.icon}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: 500 }}>
              {s.unit} {s.sub || ''} · {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
