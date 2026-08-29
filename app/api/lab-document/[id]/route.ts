import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ALLOWED_DOCUMENT_IDS } from '@/lib/verify-codes'

/**
 * Streams a lab report for on-screen viewing only.
 *
 * The PDFs deliberately live outside `public/` so they have no directly
 * fetchable URL. This route only answers same-origin requests made by the
 * in-page viewer, so pasting the URL into the address bar (or a download
 * manager) does not hand over the file.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  // Only ids present in the registry may ever be read from disk.
  if (!ALLOWED_DOCUMENT_IDS.has(id)) {
    return new Response('Not found', { status: 404 })
  }

  // Block top-level navigation and cross-origin/download attempts. The viewer
  // fetches this with sec-fetch-dest: empty from the same origin.
  const dest = request.headers.get('sec-fetch-dest')
  const site = request.headers.get('sec-fetch-site')
  if (dest === 'document' || (site && site !== 'same-origin')) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const file = await readFile(
      path.join(process.cwd(), 'lab-documents', `${id}.pdf`),
    )

    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
