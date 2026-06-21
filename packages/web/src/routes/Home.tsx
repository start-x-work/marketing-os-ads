import { ArrowRight, LayoutGrid, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

const features = [
  {
    to: "/campaign",
    title: "キャンペーン構造診断",
    description: "広告グループ・キーワード・予算の設計上の問題を洗い出します。",
    icon: LayoutGrid,
  },
  {
    to: "/creative",
    title: "クリエイティブ評価",
    description: "広告文の明確さ・関連性・CTA・コンプライアンスを評価します。",
    icon: Megaphone,
  },
];

export function Home() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.24em] text-indigo">
            Ads Toolkit
          </p>
          <h1 className="text-5xl font-light tracking-tight text-slate sm:text-6xl">
            意思決定支援を、ブラウザから。
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-muted">
            Marketing-OS Ads は、キャンペーン構造診断とクリエイティブ評価を CLI
            と同じ core ロジックで実行する Web UI です。自動入稿は行いません。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/campaign"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo/90"
            >
              診断を始める
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/start-x-work/marketing-os-ads"
              className="inline-flex items-center rounded-xl border border-border bg-white px-5 py-3 text-sm font-medium text-slate transition hover:border-indigo"
            >
              GitHubを見る
            </a>
          </div>
        </div>
        <Card className="overflow-hidden p-0">
          <div className="bg-gradient-to-br from-indigo via-cyan-400 to-teal-300 p-1">
            <div className="rounded-[1.35rem] bg-white p-7">
              <p className="text-sm text-slate-muted">v0.1 scope</p>
              <div className="mt-6 space-y-4">
                {features.map((feature, index) => (
                  <div key={feature.to} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-light text-sm font-medium text-indigo">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate">{feature.title}</p>
                      <p className="text-sm text-slate-muted">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
      <section className="grid gap-5 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.to} to={feature.to}>
              <Card className="h-full transition hover:-translate-y-1 hover:border-indigo">
                <Icon className="h-7 w-7 text-indigo" />
                <h2 className="mt-6 text-2xl font-light text-slate">
                  {feature.title}
                </h2>
                <p className="mt-3 leading-7 text-slate-muted">
                  {feature.description}
                </p>
              </Card>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
