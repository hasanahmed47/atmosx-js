'use client'
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudHail,
  Thermometer,
} from 'lucide-react'
import styles from './WeatherIcon.module.css'

const ICON_MAP = {
  thunderstorm: CloudLightning,
  drizzle: CloudDrizzle,
  sleet: CloudHail,
  rain: CloudRain,
  snow: CloudSnow,
  fog: CloudFog,
  'clear-day': Sun,
  'clear-night': Moon,
  'partly-cloudy-day': CloudSun,
  'partly-cloudy-night': CloudMoon,
  cloudy: Cloud,
  overcast: Cloud,
}

export default function WeatherIcon({ iconKey, size = 32, className = '' }) {
  const Icon = ICON_MAP[iconKey] || Thermometer

  return (
    <span className={`${styles.icon} ${className}`}>
      <Icon size={size} strokeWidth={1.75} />
    </span>
  )
}