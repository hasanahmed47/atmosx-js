'use client'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ visible, text, progress }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 28,
          }}
        >
          {/* Rings */}
          <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {[0,1,2].map(i => (
              <motion.div key={i}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ duration: 6 + i * 3, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  width: 80 + i * 24,
                  height: 80 + i * 24,
                  borderRadius: '50%',
                  border: `1px solid rgba(96,165,250,${0.3 - i * 0.08})`,
                }}
              />
            ))}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: 40, filter: 'drop-shadow(0 0 16px rgba(96,165,250,0.8))' }}
            >
              ⚡
            </motion.div>
          </div>

          {/* Logo */}
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 30, fontWeight: 900, letterSpacing: -1, color: '#fff' }}>
            Atmos<span style={{ color: '#60a5fa' }}>X</span>
          </div>

          {/* Progress */}
          <div style={{ width: 200, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #60a5fa, #34d399)', borderRadius: 2 }}
            />
          </div>

          <motion.p
            key={text}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}
          >
            {text}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
