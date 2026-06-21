# Marketing-OS Ads

AI-native ad operations toolkit for diagnosis, structured decision logs, and creative evaluation.

v0.1 CLI focuses on **decision support only** — no auto submission, auto budget changes, or creative generation.

思想・境界線: **[manifesto / 広告編](https://github.com/start-x-work/manifesto/blob/main/ads/README.md)**  
共通基盤: **[@start-x-work/mos-kit](https://github.com/start-x-work/mos-kit)**

## Install

```bash
npx @start-x-work/mos-ads campaign analyze '{"name":"Brand","budget":100000,"adGroups":[{"name":"Core","keywords":["marketing"],"ads":["Try Marketing-OS"]}]}' --format json
```

## v0.1 CLI Features

- Campaign structure diagnosis: `mos-ads campaign analyze '<json>'`
- Delivery decision log: `mos-ads campaign log '<json>'`
- Creative evaluation: `mos-ads creative evaluate "<text>" [--model gemini|openai|anthropic]`

All commands support `--format json|table|markdown` and `--quiet` (suppress commercial footer).

## Web UI (N7)

```bash
cd packages/web && pnpm build && pnpm deploy
```

Campaign structure diagnosis and creative evaluation in the browser (same core logic as CLI). Requires `GEMINI_API_KEY` in Cloudflare Pages secrets for creative evaluation.

## Docs

- [API research](./docs/api-research.md)
- [Architecture](./docs/architecture.md)

## Development

```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm build && pnpm test && pnpm typecheck
```

Requires `@start-x-work/mos-kit` (local path: `../mos-kit` until npm publish).

## License

Apache-2.0

---

🔗 marketing-os.jp / https://marketing-os.jp
