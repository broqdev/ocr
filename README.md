# OCR JS MinerU Workbench

A browser-native PDF-to-Markdown workbench inspired by the [MinerU](https://github.com/opendatalab/MinerU) pipeline and output formats.

It runs document layout analysis, OCR, formula recognition, table recognition, reading-order recovery, and Markdown reconstruction locally in the browser with [JAX.js](https://github.com/ekzhang/jax-js) on WebGPU.

## Try it

Open the [live OCR workbench](https://broqdev.github.io/ocr/) in a WebGPU-capable browser such as a current Chrome release.

Documents remain in the browser and are not uploaded. Model weights are downloaded only after confirmation and are retained in browser Cache Storage for later runs.

## Model bundle

Production uses the public [converted JAX.js medium model bundle](https://huggingface.co/hf-dev-01/pj-ocr-jaxjs-medium).

The bundle contains Safetensors artifacts and browser runtime metadata for the layout, formula, table, text detection, and text recognition stages. The app fetches these files directly from Hugging Face.

## Credits and upstream models

This project builds on the following open-source projects and Apache-2.0 model releases:

- [MinerU](https://github.com/opendatalab/MinerU) for the document-pipeline concepts, intermediate representations, and Markdown-oriented output structure.
- [JAX.js](https://github.com/ekzhang/jax-js) for WebGPU and WebAssembly tensor execution in JavaScript.

| Stage | Original model |
| --- | --- |
| Layout detection | [PaddlePaddle/PP-DocLayout-L](https://huggingface.co/PaddlePaddle/PP-DocLayout-L) |
| Formula recognition | [PaddlePaddle/PP-FormulaNet_plus-S](https://huggingface.co/PaddlePaddle/PP-FormulaNet_plus-S) |
| Table recognition | [PaddlePaddle/SLANet_plus](https://huggingface.co/PaddlePaddle/SLANet_plus) |
| OCR text detection | [PaddlePaddle/PP-OCRv6_medium_det](https://huggingface.co/PaddlePaddle/PP-OCRv6_medium_det) |
| OCR text recognition | [PaddlePaddle/PP-OCRv6_medium_rec](https://huggingface.co/PaddlePaddle/PP-OCRv6_medium_rec) |

The linked PaddlePaddle checkpoints are the conversion sources. The converted JAX.js artifacts are project-generated derivatives; upstream model licenses and notices continue to apply.

## Repository role

This is the deployment-only repository for the static site. Generated files live under `site/`; the application source and conversion tooling live in the sibling local `ocr_js` repository.

From the source checkout, `pnpm pages:build` transactionally replaces `ocr_pages/site`. It never commits or pushes. Review the generated diff here before publishing it.

GitHub Actions deploys `site/` after changes reach `main`. Do not edit generated files by hand.
