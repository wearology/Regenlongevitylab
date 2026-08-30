'use client'

import { useState } from 'react'
import { Pause, Play, Sparkles } from 'lucide-react'
import { useRegion } from '@/components/region-provider'
import { TRUST_CAROUSEL_COPY, TRUST_CAROUSEL_ITEMS } from '@/lib/trust-carousel-copy'

export function TrustCarousel() {
  const { language } = useRegion()
  const copy = TRUST_CAROUSEL_COPY[language]
  const [paused, setPaused] = useState(false)
  const toggleLabel = paused ? copy.resume : copy.pause
  const ToggleIcon = paused ? Play : Pause

  return (
    <section
      id="quality-highlights"
      className="trust-carousel"
      aria-label={copy.label}
      data-paused={paused ? 'true' : 'false'}
    >
      <div className="trust-carousel__wash" aria-hidden="true" />
      <div className="trust-carousel__surface" aria-hidden="true" />

      <div className="trust-carousel__viewport" aria-live="off">
        <div id="quality-highlights-track" className="trust-carousel__track">
          {[false, true].map((duplicate) => (
            <ul
              key={duplicate ? 'duplicate' : 'primary'}
              className={`trust-carousel__group${duplicate ? ' trust-carousel__group--duplicate' : ''}`}
              role="list"
              lang="en"
              aria-hidden={duplicate ? true : undefined}
            >
              {TRUST_CAROUSEL_ITEMS.map((item) => (
                <li key={item.id} className="trust-carousel__item">
                  <span>{item.label}</span>
                  <Sparkles className="trust-carousel__separator" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="trust-carousel__toggle"
        aria-label={toggleLabel}
        title={toggleLabel}
        aria-controls="quality-highlights-track"
        onClick={() => setPaused((value) => !value)}
      >
        <ToggleIcon className="size-4" aria-hidden="true" />
      </button>
    </section>
  )
}
