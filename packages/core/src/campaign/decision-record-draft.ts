import type { DecisionRecord } from "@start-x-work/mos-kit";
import type { Decision } from "./decision-log";

/** decision-record/v1 の下書き。判断ログから写せた項目だけを持つ。 */
export type DecisionRecordDraft = Partial<DecisionRecord> & {
  schema: "decision-record/v1";
};

export type DecisionRecordDraftResult = {
  draft: DecisionRecordDraft;
  /** 埋めていない必須の項目（decision-record/v1 のキー名）。人が埋める。 */
  missing: string[];
};

/** decision-record/v1 の必須の項目（schema を除く）。この順で missing に並べる。 */
const REQUIRED_KEYS = [
  "id",
  "written_on",
  "decided_by",
  "decision",
  "premises",
  "definitions",
  "target",
  "guard",
  "confidence",
  "review",
] as const;

const hasText = (s: string) => /\S/.test(s);

/** timestamp の先頭が実在する YYYY-MM-DD なら、その日付を返す。 */
function dateOf(timestamp: string): string | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(timestamp);
  if (!m) return undefined;
  const [, y, mo, d] = m.map(Number);
  const dt = new Date(0);
  dt.setUTCFullYear(y, mo - 1, d);
  const real =
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d;
  return real ? m[0] : undefined;
}

/**
 * 判断ログ1件から、decision-record/v1 の下書きを作る。
 *
 * 写すのは decision → 判断、rationale → 状況の前提の1行目、timestamp → 書いた日だけ。
 * 守る数字・予測の幅・期日・確度など、ログに無い項目は埋めずに missing に並べる
 * （既定値で埋めない）。判断ログ自体は変えない。
 */
export function toDecisionRecordDraft(
  decision: Decision,
): DecisionRecordDraftResult {
  const draft: DecisionRecordDraft = { schema: "decision-record/v1" };

  const writtenOn = dateOf(decision.timestamp);
  if (writtenOn) draft.written_on = writtenOn;
  if (hasText(decision.decision)) draft.decision = decision.decision;
  if (hasText(decision.rationale)) draft.premises = [decision.rationale];

  const missing = REQUIRED_KEYS.filter((key) => !(key in draft));
  return { draft, missing };
}
