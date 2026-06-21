# Quickstart — Marketing-OS Ads

利用者向けの最短手順です。診断・評価のみ — 自動入稿・自動予算変更は行いません。

## CLI（npm）

```bash
# キャンペーン構造診断（API キー不要）
npx @start-x-work/mos-ads campaign analyze \
  '{"name":"Brand","budget":100000,"adGroups":[{"name":"Core","keywords":["marketing"],"ads":["Try Marketing-OS"]}]}' \
  --format json

# クリエイティブ評価（Gemini キーが必要）
export GEMINI_API_KEY="AIza..."
npx @start-x-work/mos-ads creative evaluate "今すぐ無料トライアル" --format json
```

### Yahoo! 広告（読み取り専用）

Yahoo! 広告 API の Read-only トークンとアカウント ID を用意します。

```bash
export YAHOO_ADS_ACCESS_TOKEN="your-oauth-token"
export YAHOO_ADS_ACCOUNT_ID="1234567890"

# キャンペーン一覧
npx @start-x-work/mos-ads platform yahoo list --format json

# 直近30日メトリクス
npx @start-x-work/mos-ads platform yahoo metrics 12345 --format json
```

フラグでも指定できます:

```bash
npx @start-x-work/mos-ads platform yahoo list \
  --access-token "$YAHOO_ADS_ACCESS_TOKEN" \
  --account-id "$YAHOO_ADS_ACCOUNT_ID"
```

統合 CLI 経由:

```bash
npx @start-x-work/marketing-os ads platform yahoo list --format json --quiet
```

## Web UI

**URL:** https://marketing-os-ads.pages.dev

### 1. AI 機能（BYOK）

1. フッターの **「AI API キー（BYOK）」** を開く
2. Gemini キーを入力して **保存**
3. **クリエイティブ評価** で AI 評価を利用

### 2. Yahoo! 広告（BYOK・任意）

1. Yahoo! 広告 API で Read-only アクセストークンを取得
2. フッターの **「Yahoo! 広告（BYOK）」** で Token / Account ID / Channel を保存
3. **Yahoo 一覧** でキャンペーンを取得（読み取り専用）

## OSS と商用の境界

| OSS（本リポ） | 商用 [Marketing-OS](https://marketing-os.jp) |
|---|---|
| 構造診断・クリエイティブ評価 | 配信判断の組織運用 |
| 判断ログの構造化 | チームワークフロー・SLA |
| Yahoo 読み取り連携 | 運用 BPO・伴走 |

詳細: [manifesto — 広告編](https://github.com/start-x-work/manifesto/blob/main/ads/README.md)
