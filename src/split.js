/**
 * Split a PDF into multiple single-page documents.
 *
 * @module split
 */

import { PDFDocument } from 'pdf-lib';
import { assertPdfBuffer } from './buffer.js';
import { validatePageIndex } from './utils.js';

/**
 * Split a PDF into one document per selected page. When `pageNumbers` is
 * omitted, every page is extracted individually.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|string} input - The PDF to split.
 * @param {number[]} [pageNumbers] - Zero-based page indices to extract.
 * @returns {Promise<Buffer[]>} One PDF `Buffer` per selected page.
 * @throws {TypeError} When the input is not a valid PDF.
 * @throws {RangeError} When a page index is out of range.
 */
export async function splitPdf(input, pageNumbers) {
  const bytes = assertPdfBuffer(input);
  const source = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const pageCount = source.getPageCount();

  const indices = pageNumbers === undefined ? source.getPageIndices() : pageNumbers;
  if (!Array.isArray(indices) || indices.length === 0) {
    throw new RangeError('splitPdf requires at least one page to extract.');
  }

  const outputs = [];
  for (const pageIndex of indices) {
    validatePageIndex(pageIndex, pageCount, 'pageIndex');
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(source, [pageIndex]);
    doc.addPage(page);
    outputs.push(Buffer.from(await doc.save()));
  }

  return outputs;
}
