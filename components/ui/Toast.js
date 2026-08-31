'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info } from 'lucide-react'

export default function Toast({ message, type = 'info', onDismiss }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ y: 80, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 80, opacity: 0, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={onDismiss}
          style={{
            position: 'fixed', bottom: 28, left: '50%', zIndex: 500,
            padding: '12px 22px', borderRadius: 14, fontSize: 14,
            whiteSpace: 'nowrap', cursor: 'pointer',
            background: type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.2)'}`,
            color: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}