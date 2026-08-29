'use client'

import { useState } from 'react'
import { ChevronsLeftRight } from 'lucide-react'

export function BeforeAfterSlider() {
  const [position, setPosition] = useState(50)

  const imageStyle = {
    backgroundImage: 'url("/transformation.jpeg")',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '200% 100%',
  }

  return (
    <div className="relative aspect-[576/1367] w-full select-none overflow-hidden rounded-2xl bg-muted">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ ...imageStyle, backgroundPosition: 'right center' }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div
          className="absolute inset-y-0 left-0"
          style={{
            ...imageStyle,
            backgroundPosition: 'left center',
            width: `${10000 / position}%`,
          }}
        />
      </div>

      <span className="absolute left-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        Before
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        After
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_8px_rgba(0,0,0,0.45)]"
        style={{ left: `${position}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-lg">
          <ChevronsLeftRight className="size-5" aria-hidden="true" />
        </span>
      </div>

      <input
        type="range"
        min="1"
        max="99"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label="Before and after image comparison"
        aria-valuetext={`${position}% before, ${100 - position}% after`}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}
