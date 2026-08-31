'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Cloud, Map } from 'lucide-react'

export default function LocationMap({ lat, lon, accent, current }) {
  const [mapLoaded, setMapLoaded] = useState(false)

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05}%2C${lat - 0.05}%2C${lon + 0.05}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`

  const stats = [
    {
      label: 'Latitude',
      value: lat.toFixed(4),
      icon: MapPin,
    },
    {
      label: 'Longitude',
      value: lon.toFixed(4),
      icon: MapPin,
    },
    {
      label: 'Timezone',
      value: `UTC${current.timezone >= 0 ? '+' : ''}${Math.round(
        current.timezone / 3600
      )}`,
      icon: Clock,
    },
    {
      label: 'Cloud Cover',
      value: `${current.clouds.all}%`,
      icon: Cloud,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card"
      style={{ padding: 22 }}
    >
      <div className="section-label">Location</div>

      <div
        style={{
          position: 'relative',
          height: 200,
          borderRadius: 14,
          overflow: 'hidden',
          marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.04)',
        }}
      >
        {!mapLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 8,
              background: 'rgba(255,255,255,0.04)',
            }}
          >
            <Map size={28} />

            <div
              style={{
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              Loading map...
            </div>
          </div>
        )}

        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{
            border: 'none',
            borderRadius: 14,
            opacity: mapLoaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            filter: 'saturate(0.85) brightness(0.92)',
          }}
          onLoad={() => setMapLoaded(true)}
          title="Location Map"
          loading="lazy"
        />

        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 30,
            background:
              'linear-gradient(rgba(0,0,0,0.15), transparent)',
            pointerEvents: 'none',
          }}
        />

        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8,
            padding: '5px 12px',
            fontSize: 11,
            color: '#fff',
            textDecoration: 'none',
            fontFamily: "'Inter', sans-serif",
            transition: 'background 0.2s',
            zIndex: 2,
          }}
        >
          Open in Maps ↗
        </a>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 10,
        }}
      >
        {stats.map((item) => (
          <div
            key={item.label}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '12px 10px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                marginBottom: 6,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <item.icon size={16} />
            </div>

            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 3,
              }}
            >
              {item.value}
            </div>

            <div
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}