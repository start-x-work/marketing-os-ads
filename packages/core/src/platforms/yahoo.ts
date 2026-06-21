import type { AdPlatform, Campaign, CampaignMetrics } from "./provider";
import {
  fetchCampaignStats,
  fetchCampaigns,
  mapCampaign,
  type YahooAdsConfig,
} from "./yahoo-client";

export type { YahooAdsConfig };

export function createYahooAdsPlatform(config: YahooAdsConfig): AdPlatform {
  return {
    async list(): Promise<Campaign[]> {
      const campaigns = await fetchCampaigns(config);
      return campaigns.map(mapCampaign);
    },
    async get(id: string): Promise<Campaign> {
      const campaigns = await fetchCampaigns(config);
      const found = campaigns.find((c) => String(c.campaignId) === id);
      if (!found) {
        throw new Error(`Campaign ${id} not found`);
      }
      return mapCampaign(found);
    },
    async getMetrics(campaignId: string): Promise<CampaignMetrics> {
      const stats = await fetchCampaignStats(config, Number(campaignId));
      return {
        campaignId,
        ...stats,
      };
    },
  };
}

/** @deprecated Use createYahooAdsPlatform(config). Stub kept for backwards compatibility. */
export function createYahooAdsPlatformStub(): AdPlatform {
  return {
    async list() {
      return [];
    },
    async get(id: string) {
      return {
        id,
        name: `campaign-${id}`,
        status: "UNKNOWN",
        budget: 0,
      };
    },
    async getMetrics(campaignId: string) {
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

export function createYahooAdsPlatformFromEnv(): AdPlatform {
  const accessToken = process.env.YAHOO_ADS_ACCESS_TOKEN?.trim();
  const accountId = Number(process.env.YAHOO_ADS_ACCOUNT_ID);
  if (!accessToken || !Number.isFinite(accountId)) {
    return createYahooAdsPlatformStub();
  }
  return createYahooAdsPlatform({
    accessToken,
    accountId,
    apiVersion: process.env.YAHOO_ADS_API_VERSION,
    channel: process.env.YAHOO_ADS_CHANNEL === "display" ? "display" : "search",
  });
}
