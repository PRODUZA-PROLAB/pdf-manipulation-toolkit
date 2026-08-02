# pdf-manipulation-toolkit

Biblioteca **Node.js/JavaScript** para manipulação de PDFs: juntar (merge) e dividir (split) páginas, extrair texto, rotacionar páginas e ler/escrever metadados. Construída sobre [`pdf-lib`](https://github.com/Hopding/pdf-lib) e [`pdf-parse`](https://github.com/mozilla/pdf.js).

- ✅ Zero configuração, apenas funções `async` puras
- ✅ Entrada flexível: `Buffer`, `Uint8Array`, `ArrayBuffer` ou `string`
- ✅ PDFs criados em memória — nenhum arquivo temporário é gravado
- ✅ ESM nativo (Node.js `>=18`), sem transpilador

---

## Instalação

```bash
npm install pdf-manipulation-toolkit
```

Requer Node.js **18 ou superior**.

---

## Uso rápido

```js
import {
  mergePdfs,
  splitPdf,
  extractText,
  rotatePage,
  getMetadata,
  setMetadata,
} from "pdf-manipulation-toolkit";
```

Todas as funções aceitam `Buffer`, `Uint8Array`, `ArrayBuffer` ou `string` (UTF-8) e retornam `Promise<Buffer>`.

### Juntar PDFs (`mergePdfs`)

```js
const merged = await mergePdfs([fileA, fileB, fileC]);
// merged é um Buffer com as páginas de A, B e C, nesta ordem
```

### Dividir PDF (`splitPdf`)

```js
// Um PDF por página (documento de 3 páginas -> 3 PDFs)
const all = await splitPdf(document);

// Apenas as páginas 2 e 4 (índices 1 e 3, base zero)
const selected = await splitPdf(document, [1, 3]);
```

### Extrair texto (`extractText`)

```js
const text = await extractText(pdfBuffer);
console.log(text); // texto puro extraído via pdf-parse
```

### Rotacionar página (`rotatePage`)

```js
// Rotaciona apenas a página 0 em 90 graus
const rotated = await rotatePage(pdf, 90, 0);

// Rotaciona todas as páginas em 90 graus (padrão)
const allRotated = await rotatePage(pdf);

// O ângulo é normalizado para o múltiplo de 90 mais próximo (0/90/180/270)
const normalized = await rotatePage(pdf, 450, 0); // vira 90
```

### Metadados (`getMetadata` / `setMetadata`)

```js
const meta = await getMetadata(pdf);
// {
//   title: string|null, author: string|null, subject: string|null,
//   creator: string|null, producer: string|null, keywords: string|null,
//   creationDate: Date|null, modificationDate: Date|null,
//   pageCount: number,
// }

const updated = await setMetadata(pdf, {
  title: "Relatorio Final",
  author: "Produza ProLab",
  creator: "pdf-manipulation-toolkit",
});
```

---

## API

| Função | Descrição | Parâmetros | Retorno |
| --- | --- | --- | --- |
| `mergePdfs(sources, options?)` | Junta PDFs em um só documento | `sources: Array<Buffer\|Uint8Array\|string>`; `options.validate: boolean` | `Promise<Buffer>` |
| `splitPdf(input, pageNumbers?)` | Divide em um PDF por página | `input`; `pageNumbers?: number[]` (base zero) | `Promise<Buffer[]>` |
| `extractText(input)` | Extrai texto puro | `input` | `Promise<string>` |
| `rotatePage(input, degrees?, pageIndex?)` | Rotaciona uma página ou todas | `degrees?: number` (padrão `90`); `pageIndex?: number` | `Promise<Buffer>` |
| `getMetadata(input)` | Lê metadados + `pageCount` | `input` | `Promise<object>` |
| `setMetadata(input, metadata)` | Grava metadados no documento | `input`; `metadata: object` | `Promise<Buffer>` |
| `toBuffer(input)` | Normaliza entrada para `Buffer` | `input` | `Buffer` |
| `assertPdfBuffer(input)` | Valida cabeçalho `%PDF-` | `input` | `Buffer` |

### Validações

- Entrada não-PDF → `Error` (mensagem contém `PDF`).
- Lista vazia ou índice de página fora do intervalo → `RangeError`.
- Ângulo não numérico → `TypeError`.
- Arquivos criptografados são carregados com `ignoreEncryption: true` (rotinas de manipulação estrutural).

---

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run build` | Copia `src/` para `dist/` (build ESM puro) |
| `npm test` | Roda `node --test test/` (smoke tests + shim) |
| `npm run lint` | `prettier --check` em todos os fontes |
| `npm start` | Demo interativa exercitando toda a API |

---

## Testes

```bash
npm test
```

`test/smoke.test.mjs` contém testes reais via `node:test`: criação de PDF em memória com `pdf-lib`, merge, split, extração de texto, rotação, metadados e validação de entradas inválidas. O arquivo `test/index.js` importa o smoke test como shim, garantindo execução com `node --test test/` em qualquer setup.

---

## Variáveis de ambiente

Nenhuma variável é obrigatória no runtime. Veja [`env.example`](./env.example) para a lista opcional. Nunca crie um `.env` real com dados sensíveis — este projeto não exige segredos.

---

## Estrutura

```
pdf-manipulation-toolkit/
├── src/
│   ├── index.js          # API pública
│   ├── merge.js          # mergePdfs
│   ├── split.js          # splitPdf
│   ├── extract-text.js   # extractText
│   ├── rotate.js         # rotatePage
│   ├── metadata.js       # getMetadata / setMetadata
│   ├── utils.js          # validações compartilhadas
│   └── buffer.js         # coerção de entrada
├── test/
│   ├── smoke.test.mjs    # 19 testes
│   └── index.js          # shim
├── scripts/
│   ├── build.mjs
│   └── demo.mjs
├── package.json
└── ...
```

---

## Changelog e licença

- Alterações em [`CHANGELOG.md`](./CHANGELOG.md)
- Licença MIT — veja [`LICENSE`](./LICENSE)
