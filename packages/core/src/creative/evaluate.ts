import type { AIProvider } from "@start-x-work/mos-kit";
import { z } from "zod";
import { parseJsonFromText } from "../json";

export const CreativeEvalSchema = z.object({
  creative: z.string(),
  scores: z.object({
    clarity: z.number(),
    relevance: z.number(),
    cta: z.number(),
    compliance: z.number(),
  }),
  feedback: z.array(z.string()),
});

export type CreativeEval = z.infer<typeof CreativeEvalSchema>;

export async function evaluateCreative(
  ai: AIProvider,
  creative: string,
): Promise<CreativeEval> {
  const prompt = `Evaluate the following ad creative for clarity, relevance, CTA strength, and policy compliance. Return JSON only with keys creative, scores {clarity,relevance,cta,compliance}, and feedback (string array). Do not rewrite or generate new copy: "${creative}"`;
  const json = await ai.complete(prompt, { json: true });
  const parsed = parseJsonFromText<Partial<CreativeEval>>(json);
  return CreativeEvalSchema.parse({
    creative,
    scores: parsed.scores ?? {
      clarity: 0,
      relevance: 0,
      cta: 0,
      compliance: 0,
    },
    feedback: parsed.feedback ?? [],
  });
}
