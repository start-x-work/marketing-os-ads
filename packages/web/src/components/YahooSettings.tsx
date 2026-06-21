import { useState } from "react";
import {
  loadYahooCredentials,
  saveYahooCredentials,
  type YahooAdsCredentials,
} from "../lib/yahoo-settings";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

export function YahooSettings() {
  const [open, setOpen] = useState(false);
  const [credentials, setCredentials] = useState<YahooAdsCredentials>(() => ({
    accessToken: loadYahooCredentials()?.accessToken ?? "",
    accountId: loadYahooCredentials()?.accountId ?? "",
    channel: loadYahooCredentials()?.channel ?? "search",
  }));
  const [saved, setSaved] = useState(false);

  return (
    <Card className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-light text-slate">Yahoo! 広告（BYOK）</h2>
          <p className="mt-1 text-sm text-slate-muted">
            Business ID で取得した Read-only アクセストークンとアカウント ID
            をブラウザに保存します。入稿・予算変更は行いません。
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "閉じる" : "設定"}
        </Button>
      </div>
      {open && (
        <form
          className="mt-5 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            saveYahooCredentials(credentials);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
        >
          <div className="grid gap-2 text-sm">
            <span className="text-slate-muted">Access Token</span>
            <Input
              type="password"
              autoComplete="off"
              value={credentials.accessToken}
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  accessToken: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-2 text-sm">
            <span className="text-slate-muted">Account ID</span>
            <Input
              value={credentials.accountId}
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  accountId: event.target.value,
                }))
              }
              placeholder="1234567890"
            />
          </div>
          <div className="grid gap-2 text-sm">
            <span className="text-slate-muted">Channel</span>
            <select
              className="rounded-xl border border-border px-4 py-3"
              value={credentials.channel}
              onChange={(event) =>
                setCredentials((prev) => ({
                  ...prev,
                  channel: event.target.value as "search" | "display",
                }))
              }
            >
              <option value="search">検索広告</option>
              <option value="display">ディスプレイ広告</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit">保存</Button>
            {saved && (
              <span className="text-sm text-success">保存しました</span>
            )}
          </div>
        </form>
      )}
    </Card>
  );
}
