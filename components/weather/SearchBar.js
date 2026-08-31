'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, X, MapPin } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useThrottle } from '@/hooks/useThrottle'
import { searchCities } from '@/lib/weather'
import CountryFlag from '@/components/icons/CountryFlag'
import styles from './SearchBar.module.css'

export default function SearchBar({ onCitySelect, onGeoClick, loading }) {
  const [query, setQuery]             = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen]               = useState(false)
  const [focused, setFocused]         = useState(false)
  const [fetching, setFetching]       = useState(false)
  const wrapRef    = useRef(null)
  const skipSearch = useRef(false) // ← prevents re-search after city select

  const debouncedQuery = useDebounce(query, 400)

  const doSearch = useCallback(async (q) => {
    if (skipSearch.current) { skipSearch.current = false; return }
    if (q.length < 2) { setSuggestions([]); setOpen(false); return }
    setFetching(true)
    try {
      const results = await searchCities(q)
      setSuggestions(results || [])
      setOpen((results || []).length > 0)
    } catch { setSuggestions([]) }
    finally { setFetching(false) }
  }, [])

  const throttledSearch = useThrottle(doSearch, 1000)

  useEffect(() => { throttledSearch(debouncedQuery) }, [debouncedQuery]) // eslint-disable-line

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSelect(city) {
    skipSearch.current = true      // ← block the upcoming debounce trigger
    setQuery(city.name)
    setOpen(false)
    setSuggestions([])
    onCitySelect(city.lat, city.lon, city.name)
  }

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.inputRow}>
        <span className={`${styles.iconLeft} ${focused ? styles.iconLeftFocused : ''}`}>
          {fetching ? <Loader2 size={16} /> : <Search size={16} />}
        </span>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search any city worldwide..."
          disabled={loading}
          className={`${styles.input} ${focused ? styles.inputFocused : ''}`}
        />

        <div className={styles.iconRight}>
          <AnimatePresence mode="wait">
            {query ? (
              <motion.button key="clear"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => { setQuery(''); setSuggestions([]); setOpen(false) }}
                className={styles.clearBtn}
              ><X size={14} /></motion.button>
            ) : (
              <motion.button key="geo"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={onGeoClick}
                title="Use my location"
                className={styles.geoBtn}
              ><MapPin size={16} /></motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.92 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.92 }}
            transition={{ duration: 0.18 }}
            className={styles.dropdown}
          >
            {suggestions.map((city, i) => (
              <motion.div key={`${city.lat}-${city.lon}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onMouseDown={() => handleSelect(city)} // onMouseDown instead of onClick to fire before onBlur
                className={styles.suggestionItem}
              >
                <CountryFlag code={city.country} size={22} />
                <div>
                  <div className={styles.cityName}>{city.name}{city.state ? `, ${city.state}` : ''}</div>
                  <div className={styles.countryName}>{city.country}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}