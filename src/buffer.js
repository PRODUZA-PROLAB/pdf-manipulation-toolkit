/**
 * Buffer and input coercion helpers.
 *
 * Every public function accepts PDF data as a Node.js `Buffer`, a
 * `Uint8Array`, an `ArrayBuffer` or a UTF-8 `string`. Internally the data is
 * normalised to a `Buffer` and validated against the PDF header magic bytes
 * ("%PDF-") before being handed to `pdf-lib` / `pdf-parse`.
 *
 * @module buffer
 */

/**
 * Coerce any supported input type into a Node.js `Buffer`.
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|string} input - The PDF data.
 * @returns {Buffer} A `Buffer` view of the input.
 * @throws {TypeError} When the input type is not supported.
 */
export function toBuffer(input) {
  if (Buffer.isBuffer(input)) {
    return input;
  }
  if (input instanceof Uint8Array) {
    return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  }
  if (input instanceof ArrayBuffer) {
    return Buffer.from(input);
  }
  if (typeof input === 'string') {
    return Buffer.from(input, 'utf8');
  }
  throw new TypeError('PDF input must be a Buffer, Uint8Array, ArrayBuffer or string.');
}

/**
 * Coerce the input to a `Buffer` and validate that it starts with the PDF
 * header magic bytes (`%PDF-`).
 *
 * @param {Buffer|Uint8Array|ArrayBuffer|string} input - The PDF data.
 * @param {string} [name="input"] - Label used in the error message.
 * @returns {Buffer} The validated `Buffer`.
 * @throws {Error} When the input is not a valid PDF.
 */
export function assertPdfBuffer(input, name = 'input') {
  const buf = toBuffer(input);
  const header = buf.slice(0, 5).toString('latin1');
  if (buf.length < 5 || header !== '%PDF-') {
    throw new Error(`${name} is not a valid PDF (missing "%PDF-" header).`);
  }
  return buf;
}
