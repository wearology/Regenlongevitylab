'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Large, clean 2D success tick shown at the centre of the verification page.
 *
 * The disc springs in, the check stroke draws itself, and a soft ring radiates
 * outward once to draw the eye. Respects reduced-motion preferences.
 */
export function VerifiedTick() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="relative flex size-32 items-center justify-center sm:size-36"
      role="img"
      aria-label="Authentic product verified"
    >
      {/* Radiating ring */}
      {!reduceMotion && (
        <motion.span
          className="absolute inset-0 rounded-full bg-success/30"
          initial={{ scale: 0.7, opacity: 0.7 }}
          animate={{ scale: 1.45, opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut', delay: 0.25 }}
        />
      )}

      {/* Soft halo */}
      <motion.span
        className="absolute inset-2 rounded-full bg-success/15"
        initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Solid disc */}
      <motion.span
        className="absolute inset-4 rounded-full bg-success shadow-lg shadow-success/30"
        initial={reduceMotion ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
      />

      {/* Check stroke */}
      <svg
        viewBox="0 0 100 100"
        className="relative size-16 sm:size-[4.5rem]"
        aria-hidden="true"
      >
        <motion.path
          d="M26 51.5 L43 68 L74 35"
          fill="none"
          stroke="var(--success-foreground)"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.45, ease: 'easeOut', delay: 0.3 },
            opacity: { duration: 0.1, delay: 0.3 },
          }}
        />
      </svg>
    </div>
  )
}
