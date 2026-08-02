/**
 * Merge multiple PDF documents into a single PDF.
 *
 * @module merge
 */

import { PDFDocument } from 'pdf-lib';
import { assertPdfBuffer, toBuffer } from './buffer.js';

/**
 * Merge two or more PDFs into one. Pages are appended in the order the
 * sources appear in the array.
 *
 * @param {Array<Buffer|Uint8Array|ArrayBuffer|string>} sources - PDF documents to merge.
 * @param {object} [options] - Merge options.
 * @param {boolean} [options.validate=true] - When `false`, skips the "%PDF-"
 *   header check for each source.
 * @returns {Promise<Buffer>} The merged PDF as a `Buffer`.
 * @throws {TypeError} When `sources` is empty or not an array.
 * @throws {Error} When a source is not a valid PDF.
 */
export async function mergePdfs(sources, options = {}) {
  isNonEmptyArrayOrThrow(sources);

  const merged = await PDFDocument.create();
  for (const source of sources) {
    const bytes = options.validate === false ? toBuffer(source) : assertPdfBuffer(source);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }

  return Buffer.from(await merged.save());
}

function isNonEmptyArrayOrThrow(sources) {
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new TypeError('mergePdfs requires a non-empty array of PDF sources.');
  }
}
