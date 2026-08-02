/**
 * Plain-text extraction from a PDF.
 *
 * @module extract-text
 */

// Deep import avoids pdf-parse's top-level debug block (index.js runs a
// self-executing fixture reader when module.parent is undefined, which always
// happens when the package is imported from ESM).
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { PDFDocument } from 'pdf-lib';
import { assertPdfBuffer } from './buffer.js';

/**
 * Extract the plain text content of a PDF.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|string} input - The PDF to read.
 * @returns {Promise<string>} The extracted text.
 * @throws {TypeError} When the input is not a valid PDF.
 */
export async function extractText(input) {
  // Copy into a fresh, exact-sized Uint8Array. pdf-parse bundles pdf.js
  // v1.10.100 which misreads pooled Node Buffers (the underlying ArrayBuffer
  // is the shared 8KB pool), producing flaky "bad XRef entry" errors.
  const clean = new Uint8Array(assertPdfBuffer(input));
  try {
    const data = await pdfParse(clean);
    return typeof data.text === 'string' ? data.text : '';
  } catch {
    // pdf-parse 1.1.1 bundles an old pdf.js that cannot read object streams /
    // compressed xref tables emitted by pdf-lib. Re-save without object
    // streams and try again, so text from PDFs produced by this toolkit
    // (merge, split, rotate, setMetadata) is always extractable.
    const doc = await PDFDocument.load(clean, { ignoreEncryption: true });
    const reparsed = new Uint8Array(await doc.save({ useObjectStreams: false }));
    const data = await pdfParse(reparsed);
    return typeof data.text === 'string' ? data.text : '';
  }
}
