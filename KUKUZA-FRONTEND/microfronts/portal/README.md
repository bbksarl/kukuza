# Portal

Run dev server:

```bash
npm install
npm run dev
```

Troubleshooting:
- If you see an error about "@vitejs/plugin-react resolved to an ESM file", make sure your Node is >= 16 and run `npm install` again. We added `vite.config.mjs` and `type: module` in package.json to ensure Vite loads ESM plugins correctly.
