'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'

/**
 * Renders a lab report to canvas with pdf.js.
 *
 * Pages are rasterised in the browser, so there is no embedded PDF viewer and
 * therefore no built-in download, print, or "save as" affordance. Combined with
 * the same-origin-only document route, the report can be read but not taken.
 */
export function LabDocumentViewer({ id, title }: { id: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    // Tracks the loaded document so we can release it on unmount.
    let doc: { destroy: () => Promise<void> } | null = null

    async function render() {
      try {
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

        const loaded = await pdfjs.getDocument({
          url: `/api/lab-document/${id}`,
          // Block the viewer from attaching any interactive/JS layer.
          isEvalSupported: false,
        }).promise

        if (cancelled) {
          void loaded.destroy()
          return
        }
        doc = loaded

        // Render above the display width so these dense reports stay legible
        // when pinch-zoomed on a phone, then let CSS scale them down to fit.
        const width = Math.max(container.clientWidth || 600, 1000)
        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        const fragment = document.createDocumentFragment()

        for (let n = 1; n <= loaded.numPages; n++) {
          const page = await loaded.getPage(n)
          if (cancelled) return

          const base = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({ scale: width / base.width })

          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width * ratio)
          canvas.height = Math.floor(viewport.height * ratio)
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          canvas.className =
            'block w-full select-none rounded-lg border border-border bg-white'
          canvas.setAttribute('role', 'img')
          canvas.setAttribute('aria-label', `${title} — page ${n}`)

          await page.render({
            canvas,
            viewport,
            transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined,
          }).promise

          if (cancelled) return
          fragment.appendChild(canvas)
          page.cleanup()
        }

        if (cancelled) return
        container.replaceChildren(fragment)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void render()

    return () => {
      cancelled = true
      if (doc) void doc.destroy()
    }
  }, [id, title])

  return (
    <div className="flex flex-col gap-3">
      {status === 'loading' && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-secondary py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading document…
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-2 rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            This document could not be displayed. Please contact our team and we
            will walk you through the report.
          </p>
        </div>
      )}

      {/* Rasterised pages. Context menu is suppressed so the images cannot be
          saved straight out of the page. */}
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="flex flex-col gap-3 [&>canvas]:pointer-events-none"
      />
    </div>
  )
}
