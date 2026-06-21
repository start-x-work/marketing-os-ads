import type { AIProvider } from "@start-x-work/mos-kit";
import { describe, expect, it, vi } from "vitest";
import { evaluateCreative } from "./evaluate";

const mockAI: AIProvider = {
  complete: vi.fn().mockResolvedValue(
    JSON.stringify({
      scores: { clarity: 80, relevance: 75, cta: 60, compliance: 90 },
      feedback: ["Clarify the primary benefit in the headline"],
    }),
  ),
  embed: vi.fn(),
};

describe("evaluateCreative", () => {
  it("returns scores without generating new copy", async () => {
    const result = await evaluateCreative(mockAI, "Start your trial today");
    expect(result.creative).toBe("Start your trial today");
    expect(result.scores.compliance).toBe(90);
    expect(result.feedback.length).toBeGreaterThan(0);
  });
});
