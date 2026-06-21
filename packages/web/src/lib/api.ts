export interface CampaignStructureResult {
  campaign: string;
  adGroups: Array<{ name: string; keywords: string[]; ads: string[] }>;
  issues: string[];
}

export interface CreativeEvalResult {
  creative: string;
  scores: {
    clarity: number;
    relevance: number;
    cta: number;
    compliance: number;
  };
  feedback: string[];
}

export async function analyzeCampaign(
  campaign: unknown,
): Promise<CampaignStructureResult> {
  return request("/api/campaign/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaign }),
  });
}

export async function evaluateCreative(input: {
  text: string;
  model?: string;
}): Promise<CreativeEvalResult> {
  return request("/api/creative/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

async function request<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);
  const json = await res.json().catch(() => undefined);
  if (!res.ok) {
    const message =
      typeof json === "object" && json && "error" in json
        ? String(json.error)
        : "Request failed";
    throw new Error(message);
  }
  return json as T;
}
