import type { ReadOnlyPlatform } from "@start-x-work/mos-kit";

export interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
}

export interface CampaignMetrics {
  campaignId: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
}

/** Read-only ad platform. Write methods are intentionally omitted. */
export type AdPlatform = ReadOnlyPlatform<Campaign, CampaignMetrics>;

export interface AdGroupInput {
  name: string;
  keywords?: string[];
  ads?: string[];
}

export interface CampaignInput {
  name: string;
  budget?: number;
  status?: string;
  adGroups?: AdGroupInput[];
}
