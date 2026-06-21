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

Live: https://marketing-os-ads.pages.dev

Campaign structure diagnosis and creative evaluation in the browser. **AI keys are BYOK** — users enter Gemini/OpenAI/Anthropic keys in Settings (sessionStorage). No operator-side AI Secrets required on Cloudflare Pages.

## Yahoo! Ads platform (read-only)

```typescript
import { createYahooAdsPlatform } from "@start-x-work/marketing-os-ads-core";

const platform = createYahooAdsPlatform({
  accessToken: process.env.YAHOO_ADS_ACCESS_TOKEN!,
  accountId: Number(process.env.YAHOO_ADS_ACCOUNT_ID),
});
```

Or `createYahooAdsPlatformFromEnv()` when `YAHOO_ADS_ACCESS_TOKEN` and `YAHOO_ADS_ACCOUNT_ID` are set.

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
