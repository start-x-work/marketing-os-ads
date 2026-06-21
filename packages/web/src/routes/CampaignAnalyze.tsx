import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FeatureHeader } from "../components/FeatureHeader";
import { IssueList } from "../components/IssueList";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Textarea";
import { analyzeCampaign } from "../lib/api";

const sample = {
  name: "Brand",
  budget: 100000,
  adGroups: [
    {
      name: "Core",
      keywords: ["marketing"],
      ads: ["Try Marketing-OS"],
    },
  ],
};

export function CampaignAnalyze() {
  const [json, setJson] = useState(JSON.stringify(sample, null, 2));
  const analyze = useMutation({
    mutationFn: async () => analyzeCampaign(JSON.parse(json)),
  });

  return (
    <div>
      <FeatureHeader
        eyebrow="Campaign"
        title="キャンペーン構造を診断"
        description="JSON でキャンペーン設計を入力し、広告グループ・キーワード・予算の問題点を洗い出します。入稿は行いません。"
      />
      <Card className="mb-8">
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            analyze.mutate();
          }}
        >
          <Textarea
            value={json}
            onChange={(event) => setJson(event.target.value)}
            rows={14}
            className="font-mono text-sm"
            required
          />
          <div>
            <Button type="submit" disabled={analyze.isPending}>
              {analyze.isPending ? "診断中..." : "構造を診断する"}
            </Button>
          </div>
        </form>
      </Card>
      {analyze.error instanceof Error && (
        <Card className="mb-6 border-danger text-danger">
          {analyze.error.message}
        </Card>
      )}
      {analyze.data && (
        <div className="space-y-6">
          <Card>
            <p className="text-sm text-slate-muted">Campaign</p>
            <p className="mt-2 text-2xl font-light text-slate">
              {analyze.data.campaign}
            </p>
            <p className="mt-4 text-sm text-slate-muted">
              Ad groups: {analyze.data.adGroups.length}
            </p>
          </Card>
          <IssueList items={analyze.data.issues} />
        </div>
      )}
    </div>
  );
}
