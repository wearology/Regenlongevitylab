'use client'

import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist'
import { Loader2, TriangleAlert } from 'lucide-react'
import { useRegion } from '@/components/region-provider'
import type { Language } from '@/lib/regions'

const viewerCopy: Record<Language, { loading: string; error: string; page: string }> = {
  en: {
    loading: 'Loading document…',
    error: 'This document could not be displayed. Please contact our team and we will walk you through the report.',
    page: 'page',
  },
  ms: {
    loading: 'Sedang buka dokumen…',
    error: 'Dokumen ini tak dapat dibuka sekarang. Hubungi team kami untuk bantuan membaca laporan ini.',
    page: 'halaman',
  },
  id: {
    loading: 'Lagi membuka dokumen…',
    error: 'Dokumennya belum bisa dibuka. Hubungi tim kami, ya, untuk bantuan membaca laporan ini.',
    page: 'halaman',
  },
}

/**
 * Renders a lab report to canvas with pdf.js.
 *
 * Pages are rasterised in the browser, so there is no embedded PDF viewer and
 * therefore no built-in download, print, or "save as" affordance. Combined with
 * the same-origin-only document route, this keeps the presentation read-only.
 * These UI restrictions are not a copy-protection boundary.
 */
export function LabDocumentViewer({ id, title }: { id: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const { language } = useRegion()
  const copy = viewerCopy[language]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    // In pdf.js v6, the loading task owns network and worker cleanup, not
    // PDFDocumentProxy. Retain it even while the document is still loading.
    let loadingTask: PDFDocumentLoadingTask | null = null
    let renderTask: RenderTask | null = null

    function release() {
      renderTask?.cancel()
      renderTask = null
      const task = loadingTask
      loadingTask = null
      if (task) {
        // Cleanup can also follow an aborted load; do not create an unhandled
        // rejection or update component state after the viewer has unmounted.
        void task.destroy().catch(() => {})
      }
    }

    async function render(target: HTMLDivElement) {
      try {
        setStatus('loading')
        target.replaceChildren()
        const pdfjs = await import('pdfjs-dist')
        if (cancelled) return
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

        loadingTask = pdfjs.getDocument({
          url: `/api/lab-document/${id}`,
          // v6 removed isEvalSupported. Render only to canvas below; never
          // create an annotation, form, or scripting layer from the document.
          enableXfa: false,
        })
        const loaded = await loadingTask.promise

        if (cancelled) return

        // Render above the display width so these dense reports stay legible
        // when pinch-zoomed on a phone, then let CSS scale them down to fit.
        const width = Math.max(target.clientWidth || 600, 1000)
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
          canvas.setAttribute('aria-label', `${title} — ${copy.page} ${n}`)

          renderTask = page.render({
            canvas,
            viewport,
            transform: ratio !== 1 ? [ratio, 0, 0, ratio, 0, 0] : undefined,
          })
          try {
            await renderTask.promise
          } finally {
            renderTask = null
            page.cleanup()
          }

          if (cancelled) return
          fragment.appendChild(canvas)
        }

        if (cancelled) return
        target.replaceChildren(fragment)
        setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      } finally {
        // The canvases no longer need the PDF worker once all pages are drawn.
        release()
      }
    }

    void render(container)

    return () => {
      cancelled = true
      release()
      container.replaceChildren()
    }
  }, [id, title, copy.page])

  return (
    <div className="flex flex-col gap-3" aria-busy={status === 'loading'}>
      {status === 'loading' && (
        <div role="status" className="flex items-center justify-center gap-2 rounded-lg bg-secondary py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {copy.loading}
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
          <TriangleAlert
            className="mt-0.5 size-4 shrink-0 text-accent"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            {copy.error}
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
