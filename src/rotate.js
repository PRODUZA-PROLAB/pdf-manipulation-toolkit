/**
 * Page rotation helpers.
 *
 * @module rotate
 */

import * as pdfLib from 'pdf-lib';
import { assertPdfBuffer } from './buffer.js';
import { normalizeDegrees, validatePageIndex } from './utils.js';

const { PDFDocument, degrees: toRotation } = pdfLib;

/**
 * Rotate one page (or every page) of a PDF. The angle is normalised to the
 * nearest multiple of 90 degrees.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|string} input - The PDF to rotate.
 * @param {number} [degrees=90] - Rotation in degrees.
 * @param {number} [pageIndex] - Zero-based page to rotate. When omitted, all
 *   pages are rotated.
 * @returns {Promise<Buffer>} The rotated PDF as a `Buffer`.
 * @throws {TypeError} When `degrees` is not a finite number.
 * @throws {RangeError} When `pageIndex` is out of range.
 */
export async function rotatePage(input, degrees = 90, pageIndex) {
  const bytes = assertPdfBuffer(input);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const angle = normalizeDegrees(degrees, 'degrees');

  const apply = (page) => {
    page.setRotation(toRotation(page.getRotation().angle + angle));
  };

  if (pageIndex === undefined) {
    doc.getPages().forEach(apply);
  } else {
    validatePageIndex(pageIndex, doc.getPageCount(), 'pageIndex');
    apply(doc.getPage(pageIndex));
  }

  return Buffer.from(await doc.save());
}
