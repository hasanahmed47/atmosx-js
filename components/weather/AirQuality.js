'use client'
import { motion } from 'framer-motion'
import { AQI_LABELS, AQI_COLORS } from '@/lib/weather'

export default function AirQuality({ data }) {
  const aqi = data.list[0].main.aqi
  const comp = data.list[0].components
  const color = AQI_COLORS[aqi]
  const label = AQI_LABELS[aqi]

  const pollutants = [
    { name: 'PM2.5', value: comp.pm2_5.toFixed(1), unit: 'μg/m³' },
    { name: 'PM10',  value: comp.pm10.toFixed(1),  unit: 'μg/m³' },
    { name: 'NO₂',   value: comp.no2.toFixed(1),   unit: 'μg/m³' },
    { name: 'O₃',    value: comp.o3.toFixed(1),    unit: 'μg/m³' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="glass-card"
      style={{ padding: '24px', marginBottom: 16 }}
    >
      <div className="section-label">Air Quality</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 64, fontWeight: 900, color, lineHeight: 1, filter: `drop-shadow(0 2px 12px ${color}40)` }}>
            {aqi}
          </span>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>/ 5</span>
        </div>
        <div style={{
          padding: '8px 20px', borderRadius: 50,
          background: `${color}20`, color,
          border: `1px solid ${color}50`,
          fontSize: 14, fontWeight: 800, letterSpacing: 0.5,
          textTransform: 'uppercase'
        }}>
          {label}
        </div>
      </div>

      {/* AQI Meter */}
      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(aqi / 5) * 100}%` }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
          style={{
            height: '100%', borderRadius: 4,
            background: 'linear-gradient(90deg, #34d399, #a3e635, #fbbf24, #f97316, #ef4444)',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>
        {AQI_LABELS.slice(1).map(l => <span key={l}>{l}</span>)}
      </div>

      {/* Pollutants */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {pollutants.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 + i * 0.07 }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '16px 10px', textAlign: 'center',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            whileHover={{ y: -4, background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontWeight: 700, letterSpacing: 0.5 }}>
              {p.name}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff' }}>
              {p.value}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, fontWeight: 500 }}>{p.unit}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
