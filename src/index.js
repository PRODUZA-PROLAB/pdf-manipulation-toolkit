/**
 * pdf-manipulation-toolkit — public API entry point.
 *
 * @module pdf-manipulation-toolkit
 */

import { mergePdfs } from './merge.js';
import { splitPdf } from './split.js';
import { extractText } from './extract-text.js';
import { rotatePage } from './rotate.js';
import { getMetadata, setMetadata } from './metadata.js';
import { toBuffer, assertPdfBuffer } from './buffer.js';

export {
  mergePdfs,
  splitPdf,
  extractText,
  rotatePage,
  getMetadata,
  setMetadata,
  toBuffer,
  assertPdfBuffer,
};

export default {
  mergePdfs,
  splitPdf,
  extractText,
  rotatePage,
  getMetadata,
  setMetadata,
  toBuffer,
  assertPdfBuffer,
};
