'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Weather type → sound file mapping
const SOUND_MAP = {
  rain:    { file: '/sounds/rain.mp3',    label: 'Rain',    icon: '🌧️', volume: 0.5 },
  thunder: { file: '/sounds/thunder.mp3', label: 'Thunder', icon: '⛈️', volume: 0.5 },
  sunny:   { file: '/sounds/sunny.mp3',   label: 'Nature',  icon: '☀️', volume: 0.4 },
  cloudy:  { file: '/sounds/wind.mp3',    label: 'Wind',    icon: '☁️', volume: 0.35 },
  snow:    { file: '/sounds/snow.mp3',    label: 'Snow',    icon: '🌨️', volume: 0.4 },
  fog:     { file: '/sounds/wind.mp3',    label: 'Fog',     icon: '🌫️', volume: 0.25 },
  night:   { file: '/sounds/wind.mp3',    label: 'Night',   icon: '🌙', volume: 0.2 },
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
    audio.play().catch(() => {}) // Catch autoplay block silently
    audioRef.current = audio
    currentTypeRef.current = type
  }, [volume, stopAudio])

  // Weather type changed while playing
  useEffect(() => {
    if (playing && weatherType && weatherType !== currentTypeRef.current) {
      startAudio(weatherType)
    }
  }, [weatherType, playing, startAudio])

  // Volume changed
  useEffect(() => {
    if (audioRef.current && currentTypeRef.current) {
      const config = SOUND_MAP[currentTypeRef.current]
      if (config) audioRef.current.volume = config.volume * volume
    }
  }, [volume])

  // Cleanup on unmount
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
      {/* Volume slider — shows on hover */}
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
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 1 }}>
              {config?.icon} {config?.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13 }}>🔈</span>
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
              <span style={{ fontSize: 13 }}>🔊</span>
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
              cursor: 'pointer', fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', transition: 'all 0.2s',
            }}
          >
            ⚙️
          </motion.button>
        )}

      {/* Toggle button */}
      <motion.button
        onClick={toggleSound}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: playing ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${playing ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)'}`,
          cursor: 'pointer', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: playing ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
          transition: 'all 0.3s',
          position: 'relative', overflow: 'hidden',
        }}
        title={playing ? 'Stop sound' : `Play ${config?.label || 'ambient'} sound`}
      >
        {/* Pulse ring when playing */}
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
        {playing ? '🔊' : '🔇'}
      </motion.button>
      </div>
    </div>
  )
}
