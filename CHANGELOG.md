# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-01

### Added

- `mergePdfs(sources, options?)` — junta múltiplos PDFs em um único documento,
  preservando a ordem das páginas.
- `splitPdf(input, pageNumbers?)` — divide um PDF em um documento por página,
  com seleção opcional de páginas (índices base zero).
- `extractText(input)` — extração de texto puro via `pdf-parse`.
- `rotatePage(input, degrees?, pageIndex?)` — rotação de página(s) com
  normalização do ângulo para múltiplos de 90 (0/90/180/270).
- `getMetadata(input)` — leitura de metadados documentais e contagem de páginas.
- `setMetadata(input, metadata)` — gravação de metadados documentais.
- Helpers públicos `toBuffer(input)` e `assertPdfBuffer(input)` para coerção e
  validação de entrada.
- Entrada flexível: `Buffer`, `Uint8Array`, `ArrayBuffer` ou `string` UTF-8.
- Suite de testes com `node:test` (`test/smoke.test.mjs`, 19 testes) + shim
  `test/index.js` para execução via `node --test test/`.
- Scripts `build`, `test`, `lint` e `start`.
