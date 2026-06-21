import { useMutation } from "@tanstack/react-query";
import { FeatureHeader } from "../components/FeatureHeader";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { listYahooCampaigns } from "../lib/api";
import { loadYahooCredentials } from "../lib/yahoo-settings";

export function YahooCampaigns() {
  const list = useMutation({
    mutationFn: () => {
      const credentials = loadYahooCredentials();
      if (!credentials) {
        throw new Error(
          "Yahoo Ads credentials not configured. Set them in the footer Settings.",
        );
      }
      return listYahooCampaigns(credentials);
    },
  });

  return (
    <div>
      <FeatureHeader
        eyebrow="Yahoo Ads"
        title="キャンペーン一覧（読み取り専用）"
        description="Yahoo! 広告 API からキャンペーンを取得します。フッターの Yahoo 設定でトークンとアカウント ID を保存してください。"
      />
      <Card className="mb-8">
        <Button
          type="button"
          onClick={() => list.mutate()}
          disabled={list.isPending}
        >
          {list.isPending ? "取得中..." : "キャンペーンを取得"}
        </Button>
      </Card>
      {list.error instanceof Error && (
        <Card className="mb-6 border-danger text-danger">
          {list.error.message}
        </Card>
      )}
      {list.data && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-slate-muted">
                <tr>
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Daily budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.data.campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td className="py-3">{campaign.id}</td>
                    <td className="py-3">{campaign.name}</td>
                    <td className="py-3">{campaign.status}</td>
                    <td className="py-3">{campaign.budget.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
