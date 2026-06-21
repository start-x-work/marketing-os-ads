# marketing-os-ads — Architecture (Phase 5 B6 / N5)

**作成日:** 2026年6月21日  
**方針:** SEO 編の monorepo パターンを踏襲し、共通基盤は **コピーせず** `@start-x-work/mos-kit` に依存する。

---

## 依存関係

```
@start-x-work/mos-ads (CLI)
  └── @start-x-work/marketing-os-ads-core
        └── @start-x-work/mos-kit   ← AI / errors / output / ReadOnlyPlatform
```

| mos-kit 提供 | ads-core での用途 |
|---|---|
| `createProvider` | クリエイティブ評価 AI |
| `CliError` / `FetchError` / `AIError` | CLI・core 共通 |
| `renderOutput` / `COMMERCIAL_HINT` | CLI 出力 |
| `ReadOnlyPlatform<TEntity, TMetrics>` | 広告プラットフォーム抽象の基底 |

**コピー禁止:** `ai/`・`errors.ts`・`http/` を ads リポに再実装しない。

---

## モノレポ構成

```
marketing-os-ads/
├── packages/
│   ├── core/          # 広告固有ロジック
│   │   ├── platforms/ # AdPlatform = ReadOnlyPlatform<Campaign, CampaignMetrics>
│   │   ├── campaign/  # structure.ts, decision-log.ts
│   │   └── creative/  # evaluate.ts
│   └── cli/           # mos-ads
└── packages/web/      # 将来 (N7)
```

---

## 公開 API（core v0.1）

```typescript
export { analyzeStructure, type CampaignStructure } from "./campaign/structure";
export { recordDecision, type Decision } from "./campaign/decision-log";
export { evaluateCreative, type CreativeEval } from "./creative/evaluate";
export type { AdPlatform, Campaign, CampaignMetrics } from "./platforms/provider";
export { createYahooAdsPlatform } from "./platforms/yahoo";
```

---

## 境界（作らないもの）

- `createCampaign` / `updateBudget` / `publishAd` 等の書込 API
- クリエイティブ自動生成
- 自動入稿・自動運用ルールエンジン

---

## CI / 配布

- GitHub Actions: lint → build → test → typecheck（SEO 編と同一）
- npm: `@start-x-work/mos-ads` v0.1.0
- 前提: `@start-x-work/mos-kit` v0.1.0+ が npm 公開済み
