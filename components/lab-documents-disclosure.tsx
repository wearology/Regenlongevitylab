'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ExternalLink, FileText } from 'lucide-react'
import { LabDocumentViewer } from '@/components/lab-document-viewer'
import type { LabDocument } from '@/lib/verify-codes'

/**
 * Disclosure that reveals the batch lab reports inline. Viewers mount only
 * once opened, so nothing is fetched until the panel is expanded. Pass
 * `defaultOpen` where the reports are the primary content of the page.
 */
export function LabDocumentsDisclosure({
  documents,
  defaultOpen = false,
}: {
  documents: LabDocument[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  if (documents.length === 0) return null

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="lab-documents-panel"
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-4 py-3.5 text-left transition-colors hover:bg-secondary/70"
      >
        <span className="flex items-center gap-2.5">
          <FileText className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold text-secondary-foreground">
            COA and other Lab testing documents
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="lab-documents-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-6 pt-4">
              {documents.map((doc) => (
                <section key={doc.id} className="flex flex-col gap-2.5">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      {doc.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {doc.meta}
                    </p>
                  </div>
                  <LabDocumentViewer id={doc.id} title={doc.title} />

                  {doc.verifyLinks && doc.verifyLinks.length > 0 && (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      {doc.verifyLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex flex-1 items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary/70"
                        >
                          <span className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold text-secondary-foreground">
                              {link.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Verify on Janoshik website
                            </span>
                          </span>
                          <ExternalLink
                            className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
