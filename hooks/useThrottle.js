'use client'
import { useRef, useCallback } from 'react'

export function useThrottle(fn, delay) {
  const lastCall = useRef(0)
  return useCallback((...args) => {
    const now = Date.now()
    if (now - lastCall.current >= delay) {
      lastCall.current = now
      return fn(...args)
    }
  }, [fn, delay])
}
