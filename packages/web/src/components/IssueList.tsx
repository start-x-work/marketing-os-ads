import { CheckCircle2, CircleAlert, XCircle } from "lucide-react";
import { Card } from "./ui/Card";

interface CheckListProps {
  items: string[];
  emptyLabel?: string;
}

export function IssueList({
  items,
  emptyLabel = "問題は見つかりませんでした。",
}: CheckListProps) {
  return (
    <Card>
      <h2 className="text-xl font-light text-slate">診断結果</h2>
      {items.length === 0 ? (
        <p className="mt-5 flex items-center gap-3 text-success">
          <CheckCircle2 className="h-5 w-5" />
          {emptyLabel}
        </p>
      ) : (
        <div className="mt-5 divide-y divide-border">
          {items.map((item) => (
            <div key={item} className="flex gap-4 py-4">
              <CircleAlert className="h-5 w-5 shrink-0 text-warning" />
              <p className="text-sm leading-6 text-slate-muted">{item}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function FeedbackList({ items }: { items: string[] }) {
  return (
    <Card>
      <h2 className="text-xl font-light text-slate">フィードバック</h2>
      <div className="mt-5 divide-y divide-border">
        {items.map((item) => (
          <div key={item} className="flex gap-4 py-4">
            <XCircle className="h-5 w-5 shrink-0 text-indigo" />
            <p className="text-sm leading-6 text-slate-muted">{item}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
