import { z } from "zod";

export const DecisionSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  campaignId: z.string(),
  decision: z.string(),
  rationale: z.string(),
  expectedOutcome: z.string(),
  metricsSnapshot: z.record(z.string(), z.number()).optional(),
});

export type Decision = z.infer<typeof DecisionSchema>;

export type DecisionInput = Omit<Decision, "id" | "timestamp">;

export function recordDecision(input: DecisionInput): Decision {
  return DecisionSchema.parse({
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...input,
  });
}
