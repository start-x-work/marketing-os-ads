import type { CampaignInput } from "../platforms/provider";

export interface CampaignStructure {
  campaign: string;
  adGroups: Array<{ name: string; keywords: string[]; ads: string[] }>;
  issues: string[];
}

export function analyzeStructure(input: CampaignInput): CampaignStructure {
  const adGroups = (input.adGroups ?? []).map((group) => ({
    name: group.name,
    keywords: group.keywords ?? [],
    ads: group.ads ?? [],
  }));

  const issues: string[] = [];

  if (!input.name.trim()) {
    issues.push("Campaign name is missing");
  }
  if (adGroups.length === 0) {
    issues.push("No ad groups defined");
  }
  for (const group of adGroups) {
    if (group.keywords.length === 0) {
      issues.push(`Ad group "${group.name}" has no keywords`);
    }
    if (group.ads.length === 0) {
      issues.push(`Ad group "${group.name}" has no ads`);
    }
  }
  if ((input.budget ?? 0) <= 0) {
    issues.push("Budget is zero or unset");
  }

  return {
    campaign: input.name,
    adGroups,
    issues,
  };
}
