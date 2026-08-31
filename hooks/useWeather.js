'use client'
import { useState, useCallback } from 'react'
import { fetchWeatherByCoords } from '@/lib/weather'
import { MOCK_DATA } from '@/lib/mockData'

export function useWeather() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('idle')
  const [isMock, setIsMock] = useState(false)
  const [loadingText, setLoadingText] = useState('Detecting your location...')
  const [loadingProgress, setLoadingProgress] = useState(0)

  const fetchWeather = useCallback(async (lat, lon) => {
    setStatus('loading')
    setIsMock(false)
    setLoadingProgress(20)
    setLoadingText('Fetching weather data...')

    try {
      setLoadingProgress(50)
      const bundle = await fetchWeatherByCoords(lat, lon)
      setLoadingProgress(90)
      setLoadingText('Almost there...')
      await new Promise(r => setTimeout(r, 300))
      setLoadingProgress(100)
      setData(bundle)
      setStatus('success')
    } catch (e) {
      console.warn('API failed, using mock:', e)
      setLoadingProgress(90)
      setLoadingText('Loading demo data...')
      await new Promise(r => setTimeout(r, 400))
      setLoadingProgress(100)
      setData({ ...MOCK_DATA, lat, lon })
      setIsMock(true)
      setStatus('success')
    }
  }, [])

  return { data, status, isMock, loadingText, loadingProgress, fetchWeather }
}
