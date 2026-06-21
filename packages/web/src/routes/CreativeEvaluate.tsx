import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FeatureHeader } from "../components/FeatureHeader";
import { FeedbackList } from "../components/IssueList";
import { ScoreCard } from "../components/ScoreCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Textarea } from "../components/ui/Textarea";
import { evaluateCreative } from "../lib/api";

function averageScore(scores: Record<string, number>): number {
  const values = Object.values(scores);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function CreativeEvaluate() {
  const [text, setText] = useState("Try Marketing-OS for decision support.");
  const evaluate = useMutation({
    mutationFn: () => evaluateCreative({ text }),
  });

  return (
    <div>
      <FeatureHeader
        eyebrow="Creative"
        title="クリエイティブを評価"
        description="広告文の明確さ・関連性・CTA・コンプライアンスを評価します。新しいコピーの生成は行いません。"
      />
      <Card className="mb-8">
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            evaluate.mutate();
          }}
        >
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={6}
            placeholder="評価したい広告文"
            required
          />
          <div>
            <Button type="submit" disabled={evaluate.isPending}>
              {evaluate.isPending ? "評価中..." : "クリエイティブを評価する"}
            </Button>
          </div>
        </form>
      </Card>
      {evaluate.error instanceof Error && (
        <Card className="mb-6 border-danger text-danger">
          {evaluate.error.message}
        </Card>
      )}
      {evaluate.data && (
        <div className="space-y-6">
          <ScoreCard
            label="Overall"
            score={averageScore(evaluate.data.scores)}
          />
          <Card>
            <h2 className="text-xl font-light text-slate">スコア内訳</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Object.entries(evaluate.data.scores).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-border px-4 py-3"
                >
                  <p className="text-sm capitalize text-slate-muted">{key}</p>
                  <p className="mt-1 text-2xl font-light text-slate">{value}</p>
                </div>
              ))}
            </div>
          </Card>
          <FeedbackList items={evaluate.data.feedback} />
        </div>
      )}
    </div>
  );
}
