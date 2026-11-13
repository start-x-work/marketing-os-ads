import { runCommand } from "citty";
import { afterEach, describe, expect, it, vi } from "vitest";
import campaign from "./campaign";

const input = JSON.stringify({
  campaignId: "cmp-1",
  decision: "Pause low-performing ad group",
  rationale: "CPA exceeded target for 7 days",
  expectedOutcome: "Spend shifts to higher-intent groups",
});

async function run(rawArgs: string[]) {
  const out = vi.spyOn(console, "log").mockImplementation(() => {});
  const err = vi.spyOn(console, "error").mockImplementation(() => {});
  await runCommand(campaign, { rawArgs });
  return {
    stdout: out.mock.calls.map((c) => String(c[0])).join("\n"),
    stderr: err.mock.calls.map((c) => String(c[0])).join("\n"),
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = undefined;
});

describe("campaign log", () => {
  it("--export が無ければ、今までどおり判断ログを出す", async () => {
    const { stdout } = await run(["log", input, "--format", "json", "--quiet"]);
    const parsed = JSON.parse(stdout);
    expect(parsed.campaignId).toBe("cmp-1");
    expect(parsed.id).toBeTruthy();
  });

  it("--export decision-record で下書きと missing を出し、埋めていない項目を知らせる", async () => {
    const { stdout, stderr } = await run([
      "log",
      input,
      "--export",
      "decision-record",
      "--format",
      "json",
      "--quiet",
    ]);
    const { draft, missing } = JSON.parse(stdout);
    expect(draft.schema).toBe("decision-record/v1");
    expect(draft.decision).toBe("Pause low-performing ad group");
    expect(draft.premises).toEqual(["CPA exceeded target for 7 days"]);
    expect(draft.written_on).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(missing).toEqual(
      expect.arrayContaining(["target", "guard", "review", "confidence"]),
    );
    expect(stderr).toContain("Not filled (7)");
    expect(stderr).toContain("target");
  });

  it("知らない形式はエラーにする", async () => {
    const { stdout, stderr } = await run([
      "log",
      input,
      "--export",
      "csv",
      "--format",
      "json",
      "--quiet",
    ]);
    expect(stdout).toBe("");
    expect(stderr).toContain("E_INPUT");
    expect(process.exitCode).toBe(1);
  });
});
