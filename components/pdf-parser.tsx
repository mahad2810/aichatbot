"use client"

/**
 * Lightweight PDF-to-text helper that loads pdf.js from a CDN
 * (no NPM package needed) and extracts the plain text from every page.
 *
 * 1.  Dynamically appends the pdf.js script tag the first time it’s used.
 * 2.  Sets the workerSrc to the corresponding CDN worker.
 * 3.  Reads a File → ArrayBuffer and pipes it through pdf.js to collect
 *     all page texts, returning a single concatenated string.
 */

// Minimal type declarations for pdfjsLib to avoid requiring 'pdfjs-dist' package
declare global {
  interface Window {
    pdfjsLib: {
      getDocument: (src: { data: ArrayBuffer }) => {
        promise: Promise<PDFDocumentProxy>
      }
      GlobalWorkerOptions: {
        workerSrc: string
      }
    }
  }
}

interface PDFDocumentProxy {
  numPages: number
  getPage: (pageNumber: number) => Promise<PDFPageProxy>
}

interface PDFPageProxy {
  getTextContent: () => Promise<{
    items: Array<{ str: string }>
  }>
}

const PDF_JS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
const PDF_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"

let pdfJsLoading: Promise<typeof window.pdfjsLib> | null = null

/** Ensures pdf.js is loaded exactly once (lazy-loaded). */
async function loadPdfJs(): Promise<typeof window.pdfjsLib> {
  if (typeof window === "undefined") {
    throw new Error("pdf.js can only be loaded in the browser")
  }

  if (window.pdfjsLib) {
    return window.pdfjsLib
  }

  if (!pdfJsLoading) {
    pdfJsLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = PDF_JS_CDN
      script.async = true
      script.onload = () => {
        try {
          // The global pdfjsLib object is now correctly typed, so no @ts-expect-error is needed.
          const lib = window.pdfjsLib
          if (!lib) throw new Error("pdfjsLib not found on window")
          lib.GlobalWorkerOptions.workerSrc = PDF_WORKER_CDN
          resolve(lib)
        } catch (err) {
          reject(err)
        }
      }
      script.onerror = () => reject(new Error("Failed to load pdf.js from CDN"))
      document.head.appendChild(script)
    })
  }

  return pdfJsLoading
}

/**
 * Parses a PDF File and returns its plain-text contents.
 * Logs progress and errors to the console for debugging.
 */
export async function parsePdf(file: File): Promise<string> {
  const pdfjsLib = await loadPdfJs()

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pageTexts: string[] = []
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item) => item.str)
      .join(" ")
      .trim()
    pageTexts.push(pageText)
  }

  const fullText = pageTexts.join("\n\n")
  console.log(`[PDF-Parser] Parsed "${file.name}" – ${pdf.numPages} pages, ${fullText.length} characters.`)

  return fullText
}
