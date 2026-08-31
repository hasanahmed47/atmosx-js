'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudRain,
  CloudLightning,
  Sun,
  Cloud,
  CloudSnow,
  CloudFog,
  Moon,
  Volume1,
  Volume2,
  VolumeX,
  Settings2,
} from 'lucide-react'

const SOUND_MAP = {
  rain:    { file: '/sounds/rain.mp3',    label: 'Rain',    icon: CloudRain,      volume: 0.5 },
  thunder: { file: '/sounds/thunder.mp3', label: 'Thunder', icon: CloudLightning, volume: 0.5 },
  sunny:   { file: '/sounds/sunny.mp3',   label: 'Nature',  icon: Sun,            volume: 0.4 },
  cloudy:  { file: '/sounds/wind.mp3',    label: 'Wind',    icon: Cloud,          volume: 0.35 },
  snow:    { file: '/sounds/snow.mp3',    label: 'Snow',    icon: CloudSnow,      volume: 0.4 },
  fog:     { file: '/sounds/wind.mp3',    label: 'Fog',     icon: CloudFog,       volume: 0.25 },
  night:   { file: '/sounds/wind.mp3',    label: 'Night',   icon: Moon,           volume: 0.2 },
}

export default function WeatherSound({ weatherType }) {
  const [playing, setPlaying]       = useState(false)
  const [volume, setVolume]         = useState(0.6)
  const [showVolume, setShowVolume] = useState(false)
  const audioRef = useRef(null)
  const currentTypeRef = useRef(null)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [])

  const startAudio = useCallback((type) => {
    const config = SOUND_MAP[type]
    if (!config) return

    stopAudio()

    const audio = new Audio(config.file)
    audio.loop = true
    audio.volume = config.volume * volume
    audio.play().catch(() => {})
    audioRef.current = audio
    currentTypeRef.current = type
  }, [volume, stopAudio])

  useEffect(() => {
    if (playing && weatherType && weatherType !== currentTypeRef.current) {
      startAudio(weatherType)
    }
  }, [weatherType, playing, startAudio])

  useEffect(() => {
    if (audioRef.current && currentTypeRef.current) {
      const config = SOUND_MAP[currentTypeRef.current]
      if (config) audioRef.current.volume = config.volume * volume
    }
  }, [volume])

  useEffect(() => {
    return () => stopAudio()
  }, [stopAudio])

  function toggleSound() {
    if (playing) {
      stopAudio()
      setPlaying(false)
    } else {
      startAudio(weatherType)
      setPlaying(true)
    }
  }

  const config = SOUND_MAP[weatherType]

  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 24,
      zIndex: 50, display: 'flex', flexDirection: 'column',
      alignItems: 'flex-end', gap: 10,
    }}>
      <AnimatePresence>
        {showVolume && playing && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            style={{
              background: 'rgba(10,18,35,0.88)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 14, padding: '12px 16px',
              display: 'flex', flexDirection: 'column', gap: 8,
              minWidth: 170,
            }}
          >
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              {config?.icon && <config.icon size={13} />} {config?.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Volume1 size={13} />
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{
                  flex: 1, height: 4, borderRadius: 2,
                  appearance: 'none', outline: 'none', cursor: 'pointer',
                  background: `linear-gradient(90deg, rgba(255,255,255,0.85) ${volume * 100}%, rgba(255,255,255,0.18) ${volume * 100}%)`,
                }}
              />
              <Volume2 size={13} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {playing && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowVolume(!showVolume)}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: showVolume ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              border: `1px solid rgba(255,255,255,0.15)`,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', transition: 'all 0.2s',
            }}
          >
            <Settings2 size={16} />
          </motion.button>
        )}

      <motion.button
        onClick={toggleSound}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: playing ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${playing ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)'}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: playing ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
          transition: 'all 0.3s',
          position: 'relative', overflow: 'hidden',
        }}
        title={playing ? 'Stop sound' : `Play ${config?.label || 'ambient'} sound`}
      >
        {playing && (
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.4)',
              pointerEvents: 'none',
            }}
          />
        )}
        {playing ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </motion.button>
      </div>
    </div>
  )
}