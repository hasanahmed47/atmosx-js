'use client'
import { memo, useEffect, useState, useRef } from 'react'
import styles from './WeatherBackground.module.css'

function RainEffect() {
  return (
    <div className={styles.effectWrap}>
      {Array.from({ length: 100 }).map((_, i) => (
        <div key={i} className={styles.raindrop} style={{
          left: `${Math.random() * 100}%`,
          width: `${0.8 + Math.random() * 0.8}px`,
          height: `${18 + Math.random() * 22}px`,
          opacity: 0.25 + Math.random() * 0.35,
          animationDuration: `${0.35 + Math.random() * 0.4}s`,
          animationDelay: `${Math.random() * 2}s`,
        }} />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={`rpl-${i}`} className={styles.ripple} style={{
          bottom: `${3 + Math.random() * 8}%`,
          left: `${8 + i * 18}%`,
          animationDuration: `${1.2 + Math.random() * 0.6}s`,
          animationDelay: `${Math.random() * 1.5}s`,
        }} />
      ))}
    </div>
  )
}

function CloudEffect() {
  const clouds = [
    { top: '5%',  width: 340, height: 80,  blur: 30, opacity: 0.13, duration: 28, delay: 0 },
    { top: '16%', width: 260, height: 58,  blur: 22, opacity: 0.10, duration: 22, delay: -8 },
    { top: '30%', width: 420, height: 90,  blur: 36, opacity: 0.09, duration: 36, delay: -14 },
    { top: '9%',  width: 200, height: 48,  blur: 18, opacity: 0.08, duration: 18, delay: -5 },
    { top: '22%', width: 310, height: 70,  blur: 26, opacity: 0.10, duration: 30, delay: -20 },
    { top: '40%', width: 380, height: 84,  blur: 32, opacity: 0.07, duration: 42, delay: -10 },
  ]
  return (
    <div className={styles.effectWrap}>
      {clouds.map((c, i) => (
        <div key={i} className={styles.cloud} style={{
          top: c.top, width: c.width, height: c.height,
          filter: `blur(${c.blur}px)`, opacity: c.opacity,
          animationDuration: `${c.duration}s`,
          animationDelay: `${c.delay}s`,
        }} />
      ))}
    </div>
  )
}

function SunEffect() {
  return (
    <div className={styles.sunWrap}>
      <div className={styles.sunOuterGlow} />
      <div className={styles.sunMidGlow} />
      <div className={styles.sunCore} />
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={styles.sunRay} style={{
          transform: `rotate(${i * 30}deg)`,
          opacity: 0.12 + (i % 3) * 0.04,
        }} />
      ))}
    </div>
  )
}

function SnowEffect() {
  return (
    <div className={styles.effectWrap}>
      {Array.from({ length: 55 }).map((_, i) => {
        const size = 3 + Math.random() * 6
        return (
          <div key={i} className={styles.snowflake} style={{
            left: `${Math.random() * 100}%`,
            width: size, height: size,
            opacity: 0.5 + Math.random() * 0.4,
            animationDuration: `${4 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        )
      })}
    </div>
  )
}

function FogEffect() {
  return (
    <div className={styles.effectWrap}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={styles.fogLayer} style={{
          top: `${10 + i * 18}%`,
          animationDuration: `${18 + i * 6}s`,
          animationDelay: `${-i * 5}s`,
        }} />
      ))}
    </div>
  )
}

function NightEffect() {
  return (
    <div className={styles.effectWrap}>
      {Array.from({ length: 70 }).map((_, i) => {
        const size = 1 + Math.random() * 2.5
        return (
          <div key={i} className={styles.star} style={{
            top: `${Math.random() * 75}%`,
            left: `${Math.random() * 100}%`,
            width: size, height: size,
            opacity: 0.3 + Math.random() * 0.55,
            animationDuration: `${2 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        )
      })}
      <div className={styles.moon} />
    </div>
  )
}

// Generate SVG lightning bolt path — jagged zigzag
function generateLightningPath(startX, width) {
  const segments = 8 + Math.floor(Math.random() * 6)
  const segHeight = 100 / segments
  let path = `M ${startX} 0`
  let x = startX

  for (let i = 1; i <= segments; i++) {
    const y = i * segHeight
    const jag = (Math.random() - 0.5) * width * 1.8
    x = Math.max(5, Math.min(95, x + jag))
    path += ` L ${x} ${y}`

    // Branch bolt sometimes
    if (i === Math.floor(segments * 0.5) && Math.random() > 0.4) {
      const branchX = x
      const branchY = y
      let bx = branchX
      path += ` M ${branchX} ${branchY}`
      for (let j = 1; j <= 3; j++) {
        bx = Math.max(5, Math.min(95, bx + (Math.random() - 0.3) * 12))
        path += ` L ${bx} ${branchY + j * segHeight * 0.8}`
      }
      path += ` M ${x} ${y}`
    }
  }
  return path
}

function ThunderEffect() {
  const [bolts, setBolts] = useState([])
  const [flash, setFlash] = useState(false)
  const timerRef = useRef(null)

  function triggerLightning() {
    // Screen flash
    setFlash(true)
    setTimeout(() => setFlash(false), 180)

    // Generate 1-3 simultaneous bolts
    const count = 1 + Math.floor(Math.random() * 2)
    const newBolts = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i,
      startX: 20 + Math.random() * 60,
      width: 8 + Math.random() * 10,
      path: '',
      opacity: 0.7 + Math.random() * 0.3,
      color: Math.random() > 0.3 ? '#e8f4ff' : '#d4aaff',
      blur: 2 + Math.random() * 3,
    }))
    newBolts.forEach(b => { b.path = generateLightningPath(b.startX, b.width) })

    setBolts(newBolts)

    // Second flash
    setTimeout(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 80)
    }, 100)

    // Clear bolts after animation
    setTimeout(() => setBolts([]), 600)

    // Schedule next strike
    const nextDelay = 4000 + Math.random() * 8000
    timerRef.current = setTimeout(triggerLightning, nextDelay)
  }

  useEffect(() => {
    timerRef.current = setTimeout(triggerLightning, 1500 + Math.random() * 3000)
    return () => clearTimeout(timerRef.current)
  }, []) // eslint-disable-line

  return (
    <div className={styles.effectWrap}>
      <CloudEffect />
      <RainEffect />

      {/* Screen flash */}
      {flash && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(220, 240, 255, 0.12)',
          pointerEvents: 'none',
          animation: 'none',
        }} />
      )}

      {/* SVG Lightning bolts */}
      {bolts.length > 0 && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            zIndex: 9, pointerEvents: 'none',
          }}
        >
          {bolts.map(bolt => (
            <g key={bolt.id}>
              {/* Outer glow */}
              <path
                d={bolt.path}
                stroke={bolt.color}
                strokeWidth="1.2"
                fill="none"
                opacity={bolt.opacity * 0.4}
                style={{
                  filter: `blur(${bolt.blur + 4}px)`,
                  animation: 'lightningBolt 0.5s ease-out forwards',
                }}
              />
              {/* Mid glow */}
              <path
                d={bolt.path}
                stroke={bolt.color}
                strokeWidth="0.7"
                fill="none"
                opacity={bolt.opacity * 0.7}
                style={{
                  filter: `blur(${bolt.blur}px)`,
                  animation: 'lightningBolt 0.5s ease-out forwards',
                }}
              />
              {/* Core — sharp white bolt */}
              <path
                d={bolt.path}
                stroke="#ffffff"
                strokeWidth="0.25"
                fill="none"
                opacity={bolt.opacity}
                style={{
                  animation: 'lightningBolt 0.5s ease-out forwards',
                }}
              />
            </g>
          ))}
        </svg>
      )}
    </div>
  )
}

const WeatherBackground = memo(function WeatherBackground({ theme }) {
  if (!theme) return null
  const renderEffect = () => {
    switch (theme.type) {
      case 'rain':    return <><CloudEffect /><RainEffect /></>
      case 'thunder': return <ThunderEffect />
      case 'snow':    return <SnowEffect />
      case 'fog':     return <FogEffect />
      case 'sunny':   return <SunEffect />
      case 'night':   return <NightEffect />
      case 'cloudy':  return <CloudEffect />
      default:        return null
    }
  }
  return (
    <div className={styles.bgRoot} style={{ background: theme.bg }}>
      {renderEffect()}
      <div className={styles.bottomFade} />
    </div>
  )
})

export default WeatherBackground
