import { DecisionRecordSchema } from "@start-x-work/mos-kit";
import { describe, expect, it } from "vitest";
import type { Decision } from "./decision-log";
import { toDecisionRecordDraft } from "./decision-record-draft";

const decision: Decision = {
  id: "log-1",
  timestamp: "2026-12-01T03:04:05.000Z",
  campaignId: "cmp-1",
  decision: "Pause low-performing ad group",
  rationale: "CPA exceeded target for 7 days",
  expectedOutcome: "Spend shifts to higher-intent groups",
  metricsSnapshot: { cpa: 5200, conversions: 12 },
};

describe("toDecisionRecordDraft", () => {
  it("写せる3項目だけを写す", () => {
    const { draft } = toDecisionRecordDraft(decision);
    expect(draft).toEqual({
      schema: "decision-record/v1",
      written_on: "2026-12-01",
      decision: "Pause low-performing ad group",
      premises: ["CPA exceeded target for 7 days"],
    });
  });

  it("元のログに無い値を入れない（守る数字・幅・期日・確度は missing に出る）", () => {
    const { draft, missing } = toDecisionRecordDraft(decision);
    expect(missing).toEqual([
      "id",
      "decided_by",
      "definitions",
      "target",
      "guard",
      "confidence",
      "review",
    ]);
    for (const key of missing) expect(key in draft).toBe(false);
    // expectedOutcome・metricsSnapshot・campaignId の値も下書きに入らない
    const text = JSON.stringify(draft);
    expect(text).not.toContain("Spend shifts");
    expect(text).not.toContain("5200");
    expect(text).not.toContain("cmp-1");
    expect(text).not.toContain("log-1");
  });

  it("空欄の decision・rationale は写さず missing に出す", () => {
    const { draft, missing } = toDecisionRecordDraft({
      ...decision,
      decision: "  ",
      rationale: "",
    });
    expect(draft.decision).toBeUndefined();
    expect(draft.premises).toBeUndefined();
    expect(missing).toContain("decision");
    expect(missing).toContain("premises");
  });

  it("日付として読めない timestamp は写さず missing に出す", () => {
    for (const timestamp of ["yesterday", "2027-02-30T00:00:00Z", ""]) {
      const { draft, missing } = toDecisionRecordDraft({
        ...decision,
        timestamp,
      });
      expect(draft.written_on).toBeUndefined();
      expect(missing).toContain("written_on");
    }
  });

  it("判断ログを書き換えない", () => {
    const before = structuredClone(decision);
    toDecisionRecordDraft(Object.freeze({ ...decision }));
    expect(decision).toEqual(before);
  });

  it("下書きのままでは DecisionRecordSchema を通らない", () => {
    const { draft } = toDecisionRecordDraft(decision);
    expect(DecisionRecordSchema.safeParse(draft).success).toBe(false);
  });

  it("人が missing を全部埋めた記録は DecisionRecordSchema を通る", () => {
    const { draft } = toDecisionRecordDraft(decision);
    const filled = {
      ...draft,
      id: "record-1",
      decided_by: "運用担当",
      definitions: [
        {
          metric: "CPA",
          definition: "広告費 ÷ コンバージョン数",
          source: "広告の管理画面",
        },
        {
          metric: "コンバージョン数",
          definition: "購入完了の件数",
          source: "計測タグ",
        },
      ],
      target: {
        metric: "コンバージョン数",
        direction: "up",
        baseline: 12,
        interval: { low: 13, high: 16 },
        unit: "件",
      },
      guard: { metric: "CPA", comparator: "<=", threshold: 5000, unit: "円" },
      confidence: { level: "medium", reason: "似た判断の前例がある" },
      review: { due_on: "2026-12-29", compare_with: "停止前の4週間" },
    };
    const res = DecisionRecordSchema.safeParse(filled);
    expect(res.success, JSON.stringify(res.error?.issues)).toBe(true);
  });
});
