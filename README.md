# OCR Pages

Deployment-only repository for the static OCR JS workbench.

The source project lives in the sibling `../ocr_js` repository. Do not edit `site/` by hand: a production build from `ocr_js` replaces it transactionally.

```bash
cd ../ocr_js
pnpm build
```

For continuous local rebuilding and staging, run `pnpm pages:watch`. These commands update this repository without committing or pushing. Review the generated changes here, then commit and push them when they are ready to deploy.

GitHub Actions publishes `site/` to GitHub Pages on pushes to `main`, or when the deployment workflow is run manually. In the remote repository settings, set **Pages → Source** to **GitHub Actions**.
