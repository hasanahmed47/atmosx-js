'use client'
import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useWeather } from '@/hooks/useWeather'
import { getWeatherTheme } from '@/lib/weather'
import WeatherBackground from '@/components/ui/WeatherBackground'
import LoadingScreen from '@/components/ui/LoadingScreen'
import Toast from '@/components/ui/Toast'
import SearchBar from '@/components/weather/SearchBar'
import LocationMap from '@/components/ui/LocationMap'
import WeatherSound from '@/components/ui/WeatherSound'
import { WEATHER_MAP } from '@/lib/weather'

// Lazy load heavy components
const MainWeatherCard = dynamic(() => import('@/components/weather/MainWeatherCard'))
const HourlyForecast  = dynamic(() => import('@/components/weather/HourlyForecast'))
const DailyForecast   = dynamic(() => import('@/components/weather/DailyForecast'))
const AirQuality      = dynamic(() => import('@/components/weather/AirQuality'))
const SunUV           = dynamic(() => import('@/components/weather/SunUV'))

// Skeleton
function Skeleton({ h = 120 }) {
  return <div className="skeleton" style={{ height: h, borderRadius: 20, marginBottom: 14 }} />
}

export default function WeatherApp() {
  const [unit, setUnit] = useState('C')
  const [toast, setToast] = useState(null)
  const [showLoading, setShowLoading] = useState(true)
  const { data, status, isMock, loadingText, loadingProgress, fetchWeather } = useWeather()

  const theme = data
    ? getWeatherTheme(data.current.weather[0].id, data.current.dt > data.current.sys.sunrise && data.current.dt < data.current.sys.sunset)
    : { type: 'night', bg: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', accent: '#818cf8' }

  const showToast = (msg, type = 'info') => setToast({ msg, type })

  const handleCoords = useCallback(async (lat, lon) => {
    await fetchWeather(lat, lon)
    setShowLoading(false)
  }, [fetchWeather])

  const handleGeo = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('Geolocation not supported', 'error')
      fetchWeather(51.5074, -0.1278).then(() => setShowLoading(false))
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => handleCoords(pos.coords.latitude, pos.coords.longitude),
      () => {
        showToast('Location denied — showing London', 'error')
        fetchWeather(51.5074, -0.1278).then(() => setShowLoading(false))
      },
      { timeout: 8000 }
    )
  }, [handleCoords, fetchWeather])

  useEffect(() => { handleGeo() }, []) // eslint-disable-line

  return (
    <>
      <WeatherBackground theme={theme} />
      <LoadingScreen visible={showLoading} text={loadingText} progress={loadingProgress} />

      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 860, margin: '0 auto',
        padding: '20px 16px 60px',
        display: showLoading ? 'none' : 'block',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, boxShadow: `0 0 20px ${theme.accent}40`,
            }}>⚡</div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: '#fff' }}>
                Atmos<span style={{ color: theme.accent }}>X</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginTop: -2 }}>
                WEATHER INTELLIGENCE
              </div>
            </div>
          </div>

          {/* Unit Toggle */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: 4, gap: 2,
          }}>
            {['C','F'].map(u => (
              <button key={u} onClick={() => setUnit(u)} style={{
                padding: '6px 16px', borderRadius: 9,
                border: unit === u ? `1px solid ${theme.accent}60` : '1px solid transparent',
                background: unit === u ? `${theme.accent}22` : 'transparent',
                color: unit === u ? theme.accent : 'rgba(255,255,255,0.45)',
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}>°{u}</button>
            ))}
          </div>
        </motion.div>

        {/* Search */}
        <SearchBar
          onCitySelect={handleCoords}
          onGeoClick={handleGeo}
          loading={status === 'loading'}
        />

        {/* Demo Banner */}
        <AnimatePresence>
          {isMock && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.25)',
                borderRadius: 14, padding: '11px 18px',
                marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
                fontSize: 13, color: '#fbbf24',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span>
                <strong>OFFLINE MODE</strong> — API key activates in ~2 hours. Showing Karachi sample data.
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton while loading */}
        {status === 'loading' && !data && (
          <div>
            <Skeleton h={340} />
            <Skeleton h={130} />
            <Skeleton h={270} />
            <Skeleton h={180} />
          </div>
        )}

        {/* Weather Content */}
        <AnimatePresence>
          {data && (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MainWeatherCard data={data.current} unit={unit} theme={theme} />
              <HourlyForecast items={data.forecast.list.slice(0, 8)} offset={data.current.timezone} unit={unit} accent={theme.accent} />
              <DailyForecast  items={data.forecast.list} offset={data.current.timezone} unit={unit} accent={theme.accent} />
              <AirQuality data={data.air} />
              <SunUV data={data.current} accent={theme.accent} />

              {/* Location Card */}
              <LocationMap
                lat={data.lat}
                lon={data.lon}
                accent={theme.accent}
                current={data.current}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WeatherSound weatherType={theme.type} />
      <Toast message={toast?.msg || null} type={toast?.type} onDismiss={() => setToast(null)} />
    </>
  )
}
