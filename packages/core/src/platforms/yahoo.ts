import type { AdPlatform, Campaign, CampaignMetrics } from "./provider";

export function createYahooAdsPlatform(): AdPlatform {
  return {
    async list() {
      return [];
    },
    async get(id: string): Promise<Campaign> {
      return {
        id,
        name: `campaign-${id}`,
        status: "UNKNOWN",
        budget: 0,
      };
    },
    async getMetrics(campaignId: string): Promise<CampaignMetrics> {
      return {
        campaignId,
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
      };
    },
  };
}
