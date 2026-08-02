import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PDFDocument, StandardFonts } from 'pdf-lib';

import {
  mergePdfs,
  splitPdf,
  extractText,
  rotatePage,
  getMetadata,
  setMetadata,
  assertPdfBuffer,
  toBuffer,
} from '../src/index.js';

const SAMPLE_TEXT = 'Hello PDF Toolkit 12345';

async function makePdf(text, { pages = 1, title, author } = {}) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pages; i += 1) {
    const page = doc.addPage([300, 300]);
    page.drawText(text, { x: 50, y: 150, size: 20, font });
  }
  if (title) doc.setTitle(title);
  if (author) doc.setAuthor(author);
  return Buffer.from(await doc.save());
}

test('mergePdfs combines two PDFs into a 2-page document', async () => {
  const a = await makePdf('A');
  const b = await makePdf('B');
  const merged = await mergePdfs([a, b]);
  const doc = await PDFDocument.load(merged);
  assert.equal(doc.getPageCount(), 2);
});

test('mergePdfs sums the page count of all input documents', async () => {
  const multi = await makePdf('X', { pages: 2 });
  const single = await makePdf('Y');
  const merged = await mergePdfs([multi, single]);
  const doc = await PDFDocument.load(merged);
  assert.equal(doc.getPageCount(), 3);
});

test('mergePdfs rejects an empty array', async () => {
  await assert.rejects(() => mergePdfs([]), TypeError);
});

test('mergePdfs rejects a source that is not a PDF', async () => {
  await assert.rejects(() => mergePdfs([Buffer.from('this is not a pdf')]), /PDF/);
});

test('splitPdf splits a 3-page PDF into 3 single-page documents', async () => {
  const pdf = await makePdf('P', { pages: 3 });
  const parts = await splitPdf(pdf);
  assert.equal(parts.length, 3);
  for (const part of parts) {
    const doc = await PDFDocument.load(part);
    assert.equal(doc.getPageCount(), 1);
  }
});

test('splitPdf with pageNumbers extracts only the requested pages', async () => {
  const pdf = await makePdf('P', { pages: 4 });
  const parts = await splitPdf(pdf, [1, 3]);
  assert.equal(parts.length, 2);
});

test('splitPdf rejects a page index out of range', async () => {
  const pdf = await makePdf('P', { pages: 2 });
  await assert.rejects(() => splitPdf(pdf, [5]), RangeError);
});

test('splitPdf rejects an empty page list', async () => {
  const pdf = await makePdf('P', { pages: 2 });
  await assert.rejects(() => splitPdf(pdf, []), RangeError);
});

test('extractText returns the text written in the PDF', async () => {
  const pdf = await makePdf(SAMPLE_TEXT);
  const text = await extractText(pdf);
  assert.match(text, /Hello PDF Toolkit/);
});

test('extractText rejects a buffer that is not a PDF', async () => {
  await assert.rejects(() => extractText(Buffer.from('nope')), /PDF/);
});

test('rotatePage rotates page 0 by 90 degrees', async () => {
  const pdf = await makePdf('R');
  const rotated = await rotatePage(pdf, 90, 0);
  const doc = await PDFDocument.load(rotated);
  assert.equal(doc.getPage(0).getRotation().angle, 90);
});

test('rotatePage normalises 450 degrees to 90', async () => {
  const pdf = await makePdf('R');
  const rotated = await rotatePage(pdf, 450, 0);
  const doc = await PDFDocument.load(rotated);
  assert.equal(doc.getPage(0).getRotation().angle, 90);
});

test('rotatePage rejects a non-numeric angle', async () => {
  const pdf = await makePdf('R');
  await assert.rejects(() => rotatePage(pdf, 'noventa', 0), TypeError);
});

test('rotatePage rejects a page index out of range', async () => {
  const pdf = await makePdf('R');
  await assert.rejects(() => rotatePage(pdf, 90, 9), RangeError);
});

test('getMetadata returns null fields and the correct page count', async () => {
  const pdf = await makePdf('M', { pages: 2 });
  const meta = await getMetadata(pdf);
  assert.equal(meta.pageCount, 2);
  assert.equal(meta.title, null);
  assert.equal(meta.author, null);
});

test('getMetadata reads title and author written into the PDF', async () => {
  const pdf = await makePdf('M', { title: 'Relatorio X', author: 'ProLab' });
  const meta = await getMetadata(pdf);
  assert.equal(meta.title, 'Relatorio X');
  assert.equal(meta.author, 'ProLab');
});

test('setMetadata writes metadata and getMetadata confirms it', async () => {
  const pdf = await makePdf('M');
  const updated = await setMetadata(pdf, {
    title: 'Novo Titulo',
    creator: 'PDF Toolkit',
  });
  const meta = await getMetadata(updated);
  assert.equal(meta.title, 'Novo Titulo');
  assert.equal(meta.creator, 'PDF Toolkit');
});

test('toBuffer converts a Uint8Array into a Buffer', () => {
  const u8 = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 49]); // "%PDF-1.1"
  const buf = toBuffer(u8);
  assert.ok(Buffer.isBuffer(buf));
  assert.equal(buf.toString('latin1').slice(0, 5), '%PDF-');
});

test('assertPdfBuffer rejects a buffer without the PDF header', () => {
  assert.throws(() => assertPdfBuffer(Buffer.from('hello world')), /PDF/);
});
