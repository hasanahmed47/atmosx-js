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
      style={{ padding: '22px', marginBottom: 14 }}
    >
      <div className="section-label">Air Quality</div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 52, fontWeight: 900, color, lineHeight: 1 }}>
            {aqi}
          </span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/ 5</span>
        </div>
        <div style={{
          padding: '6px 18px', borderRadius: 50,
          background: `${color}20`, color,
          border: `1px solid ${color}50`,
          fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {pollutants.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 + i * 0.07 }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '12px 8px', textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6, fontWeight: 600 }}>
              {p.name}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff' }}>
              {p.value}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{p.unit}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
