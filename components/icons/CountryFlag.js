'use client'
import styles from './CountryFlag.module.css'

export default function CountryFlag({ code, size = 20 }) {
  if (!code) return null

  return (
    <img
      className={styles.flag}
      src={`https://flagcdn.com/w40/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      alt={code}
      width={size}
      height={Math.round(size * 0.75)}
      loading="lazy"
    />
  )
}