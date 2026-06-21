# 広告 API 調査 — Phase 5 B1 / N3

**作成日:** 2026年6月21日  
**目的:** Phase 6 着手前に、各プラットフォームの認証・読み取り API・規約リスクを整理する。  
**方針:** OSS は「診断・評価・構造化・読み取り」のみ。自動入稿・自動運用は対象外。

---

## サマリー（着手候補）

| プラットフォーム | 認証 | 実装コスト | 規約リスク | v0.1 候補 |
|---|---|---|---|---|
| Yahoo! / LINEヤフー広告 (LY Ads) | OAuth2 (Business ID) | 中 | 低 | **推奨** |
| LINE Ads | OAuth2 + LINE Business | 中 | 低 | **推奨** |
| Google Ads | OAuth2 + Developer Token | 高 (GAQL) | 中 | 将来 |
| Meta Ads | OAuth2 + Business Manager | 高 | 中 | 将来 |
| TikTok Ads | OAuth2 | 中 | 中 | 将来 |
| X Ads | OAuth2 | 中 | 高 | 非推奨 |

**B2 推奨（Cursor 判断材料）:** 日本市場・規約リスク・読み取り API の明確さから、v0.1 は **Yahoo! / LY Ads** を第一候補、**LINE Ads** を第二候補とする。最終決定は手動（B2）。

---

## 1. Yahoo! / LINEヤフー広告 (LY Ads API)

**公式:** [Developer Center](https://ads-developers.yahoo.co.jp/)

### 認証

- OAuth 2.0 **認可コードフローのみ**
- Business ID 単位で広告アカウント権限（Read-only / Edit）が付与される
- Read-only ロールでは GET 系参照が中心（レポート・エクスポートは例外あり）
- エンドポイント例:
  - 認可: `https://biz-oauth.yahoo.co.jp/oauth/v1/authorize`
  - トークン: `https://biz-oauth.yahoo.co.jp/oauth/v1/token`
- Search Ads API ベース: `https://ads-search.yahooapis.jp/api`
- Display Ads API ベース: `https://ads-display.yahooapis.jp/api`

### 読み取りに使える API（v0.1 向け）

- `CampaignService/get` — キャンペーン一覧・属性の参照
- `ReportDefinitionService/add` + `download` — キャンペーン/広告グループ単位の実績 CSV
- OpenAPI 仕様が公開されており、クライアント生成が可能

### レート制限・運用

- アクセストークン有効期限は短い（約1時間）。refresh token で更新する設計が前提
- API バージョンは v19 系が現行（旧 v7/v9 等は非推奨）

### 規約・自動化

- Read-only 権限 + レポート取得のみであれば、OSS の「実績参照・構造診断」と整合
- **入稿・予算変更・自動最適化 API は v0.1 スコープ外**（interface にも定義しない）

### 実装コスト評価: **中**

---

## 2. LINE Ads

**公式:** [LINE Ads API](https://developers.line.biz/en/docs/line-ads-api/)（LINE Developers）

### 認証

- OAuth 2.0 + LINE Business アカウント連携
- 広告アカウント単位の権限管理

### 読み取り

- キャンペーン・広告グループ・レポート系の GET エンドポイント（詳細は公式 Reference で版管理）
- 日本市場向けドキュメントは日英混在。実装前に対象エンドポイントの版を固定すること

### 規約・自動化

- サードパーティツールは LINE 側の利用規約・審査対象になりうる
- **読み取り + 評価・ログ構造化**に限定すればリスクは LY Ads と同程度

### 実装コスト評価: **中**

---

## 3. Google Ads

**公式:** [Google Ads API](https://developers.google.com/google-ads/api/docs/start)

### 認証

- OAuth2 + **Developer Token**（本番利用には Google 審査）
- 顧客 ID / ログインカスタマー ID の管理が必要

### 読み取り

- GAQL (`GoogleAdsService.Search`) でキャンペーン・メトリクス参照は可能
- レポート用途でも GAQL で代替可能

### 規約・自動化

- [Third-party policy](https://support.google.com/adspolicy/answer/6169371) により、自動化ツールはポリシー順守が必須
- Developer Token 取得のハードルが高く、**v0.1 には重い**

### 実装コスト評価: **高** / 規約リスク: **中**

---

## 4. Meta (Facebook) Ads

**公式:** [Marketing API](https://developers.facebook.com/docs/marketing-apis/)

### 認証

- OAuth2 + Business Manager + アプリ審査
- トークン種別（User / System User）の設計が必要

### 読み取り

- Campaign / AdSet / Insights API で参照可能
- API 変更頻度が高い

### 規約・自動化

- Custom Audiences / 自動化関連ポリシーが厳格
- OSS 利用者が規約違反に問われないよう、**書き込み API は提供しない**

### 実装コスト評価: **高** / 規約リスク: **中**

---

## 5. TikTok Ads

**公式:** [TikTok Marketing API](https://business-api.tiktok.com/portal/docs)

### 認証

- OAuth2 + Advertiser 承認

### 読み取り

- Campaign / Reporting API
- ドキュメント品質は改善途上。エンドポイント版の固定が必要

### 規約・自動化

- 自動化・データ利用に関する Developer Terms あり
- v0.1 優先度は低め

### 実装コスト評価: **中** / 規約リスク: **中**

---

## 6. X (Twitter) Ads

**公式:** [X Ads API](https://developer.x.com/en/docs/x-ads-api)

### 認証

- OAuth2（有料プラン・制限の変更履歴あり）

### 読み取り

- Analytics / Campaign 参照 API は存在するが、アクセス要件が変動しやすい

### 規約・自動化

- API 利用ポリシー・有料化方針の不確実性が **高**

### 実装コスト評価: **中** / 規約リスク: **高（非推奨）**

---

## B3 規約リスク — 結論（ドラフト）

| 操作 | OSS v0.1 | リスク |
|---|---|---|
| キャンペーン構造の診断 | ○ | 低 |
| 配信判断のログ構造化（人間入力） | ○ | 低 |
| クリエイティブ評価（AI 評価のみ） | ○ | 低 |
| プラットフォーム実績の読み取り | △ 限定 | 低〜中 |
| 自動入稿・自動予算変更 | ✗ | 高 |

**構造保証:** `@start-x-work/mos-kit` の `ReadOnlyPlatform` を広告プラットフォーム型の基底として使い、書込メソッドを interface に含めない。

---

## B4 スコープ確定（ドラフト・B2 確定待ち）

| 機能 | v0.1 |
|---|---|
| キャンペーン構造診断 (`campaign analyze`) | ○ |
| 配信判断ログ (`campaign log`) | ○ |
| クリエイティブ評価 (`creative evaluate`) | ○ |
| Yahoo! / LY Ads 読み取り（スタブ→API） | △ スタブから |
| 自動運用・入稿・生成 | ✗ |

---

## 参考リンク

- [LY Ads OAuth](https://ads-developers.yahoo.co.jp/en/ads-api/developers-guide/oauth.html)
- [LY Ads API Call](https://ads-developers.yahoo.co.jp/en/ads-api/startup-guide/api-call.html)
- [Google Ads API Overview](https://developers.google.com/google-ads/api/docs/start)
- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis/)
