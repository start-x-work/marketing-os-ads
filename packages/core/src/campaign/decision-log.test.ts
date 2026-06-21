import { describe, expect, it } from "vitest";
import { recordDecision } from "./decision-log";

describe("recordDecision", () => {
  it("records a structured decision without executing it", () => {
    const decision = recordDecision({
      campaignId: "cmp-1",
      decision: "Pause low-performing ad group",
      rationale: "CPA exceeded target for 7 days",
      expectedOutcome: "Spend shifts to higher-intent groups",
    });
    expect(decision.id).toBeTruthy();
    expect(decision.timestamp).toBeTruthy();
    expect(decision.campaignId).toBe("cmp-1");
  });
});
