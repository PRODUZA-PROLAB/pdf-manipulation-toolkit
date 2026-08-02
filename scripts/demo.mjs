/**
 * Interactive demo for `npm start`.
 *
 * Creates two PDFs in memory and exercises every public API: merge, split,
 * text extraction, rotation and metadata.
 */

import { PDFDocument, StandardFonts } from 'pdf-lib';
import { mergePdfs, splitPdf, extractText, rotatePage, getMetadata } from '../src/index.js';

async function makePdf(text, title) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([400, 400]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText(text, { x: 40, y: 200, size: 24, font });
  doc.setTitle(title);
  return Buffer.from(await doc.save());
}

async function main() {
  const a = await makePdf('Primeiro PDF', 'Documento A');
  const b = await makePdf('Segundo PDF', 'Documento B');

  const merged = await mergePdfs([a, b]);
  const meta = await getMetadata(merged);
  console.log(`mergePdfs -> ${meta.pageCount} paginas`);

  const parts = await splitPdf(merged);
  console.log(`splitPdf -> ${parts.length} documentos`);

  const text = await extractText(a);
  console.log(`extractText -> "${text.trim()}"`);

  const rotated = await rotatePage(a, 90, 0);
  const rotatedDoc = await PDFDocument.load(rotated);
  console.log(`rotatePage -> angulo ${rotatedDoc.getPage(0).getRotation().angle} graus`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
