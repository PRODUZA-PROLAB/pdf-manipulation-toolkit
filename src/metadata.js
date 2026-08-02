/**
 * PDF metadata reading and writing.
 *
 * @module metadata
 */

import { PDFDocument } from 'pdf-lib';
import { assertPdfBuffer } from './buffer.js';

/**
 * Read the document-level metadata of a PDF.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|string} input - The PDF to inspect.
 * @returns {Promise<object>} Metadata object. `pageCount` is always present;
 *   string fields default to `null` when absent.
 * @throws {TypeError} When the input is not a valid PDF.
 */
export async function getMetadata(input) {
  const bytes = assertPdfBuffer(input);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  return {
    title: doc.getTitle() ?? null,
    author: doc.getAuthor() ?? null,
    subject: doc.getSubject() ?? null,
    creator: doc.getCreator() ?? null,
    producer: doc.getProducer() ?? null,
    keywords: doc.getKeywords() ?? null,
    creationDate: doc.getCreationDate() ?? null,
    modificationDate: doc.getModificationDate() ?? null,
    pageCount: doc.getPageCount(),
  };
}

/**
 * Write document-level metadata onto a PDF. Supported keys map to the
 * `pdf-lib` setters: `title`, `author`, `subject`, `creator`, `producer`,
 * `keywords`, `creationDate` and `modificationDate`.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|string} input - The PDF to update.
 * @param {object} metadata - A map of metadata keys to values.
 * @returns {Promise<Buffer>} The updated PDF as a `Buffer`.
 * @throws {TypeError} When the input is not a valid PDF.
 */
export async function setMetadata(input, metadata = {}) {
  const bytes = assertPdfBuffer(input);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

  for (const [key, value] of Object.entries(metadata)) {
    const method = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
    if (typeof doc[method] !== 'function') {
      continue;
    }
    doc[method](value == null ? '' : String(value));
  }

  return Buffer.from(await doc.save());
}
