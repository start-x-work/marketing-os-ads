import { CliError, FetchError } from "@start-x-work/mos-kit";

export interface YahooAdsConfig {
  accessToken: string;
  accountId: number;
  apiVersion?: string;
  channel?: "search" | "display";
}

interface YahooEnvelope<T> {
  errors?: Array<{ code?: string; message?: string }>;
  rval?: T;
}

interface YahooCampaignValue {
  campaign?: {
    campaignId?: number;
    campaignName?: string;
    userStatus?: string;
    dailyBudget?: number;
  };
}

interface YahooStatsValue {
  stats?: {
    id?: number;
    stats?: {
      imp?: number;
      clicks?: number;
      cost?: number;
      conversions?: number;
    };
  };
}

function baseUrl(config: YahooAdsConfig): string {
  return config.channel === "display"
    ? "https://ads-display.yahooapis.jp/api"
    : "https://ads-search.yahooapis.jp/api";
}

export async function yahooRequest<T>(
  config: YahooAdsConfig,
  service: string,
  operation: string,
  body: Record<string, unknown>,
): Promise<T> {
  const version = config.apiVersion ?? "v19";
  const url = `${baseUrl(config)}/${version}/${service}/${operation}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new FetchError(url, res.status, await res.text());
  }

  const json = (await res.json()) as YahooEnvelope<T>;
  if (json.errors?.length) {
    throw new CliError(
      `Yahoo Ads API error: ${json.errors.map((e) => e.message ?? e.code).join(", ")}`,
      "E_FETCH",
    );
  }
  if (!json.rval) {
    throw new CliError(
      `Yahoo Ads API returned empty response for ${service}/${operation}`,
      "E_FETCH",
    );
  }
  return json.rval;
}

export async function fetchCampaigns(config: YahooAdsConfig) {
  const rval = await yahooRequest<{ values?: YahooCampaignValue[] }>(
    config,
    "CampaignService",
    "get",
    { accountId: config.accountId },
  );
  return (rval.values ?? [])
    .map((entry) => entry.campaign)
    .filter((campaign): campaign is NonNullable<typeof campaign> =>
      Boolean(campaign?.campaignId),
    );
}

export async function fetchCampaignStats(
  config: YahooAdsConfig,
  campaignId: number,
) {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(end.getUTCDate() - 30);

  const rval = await yahooRequest<{ values?: YahooStatsValue[] }>(
    config,
    "StatsService",
    "get",
    {
      accountId: config.accountId,
      type: "CAMPAIGN",
      ids: [campaignId],
      dateRange: {
        startDate: start.toISOString().slice(0, 10).replace(/-/g, ""),
        endDate: end.toISOString().slice(0, 10).replace(/-/g, ""),
      },
    },
  );

  const stats = rval.values?.[0]?.stats?.stats;
  return {
    impressions: stats?.imp ?? 0,
    clicks: stats?.clicks ?? 0,
    cost: stats?.cost ?? 0,
    conversions: stats?.conversions ?? 0,
  };
}

export function mapCampaign(campaign: {
  campaignId?: number;
  campaignName?: string;
  userStatus?: string;
  dailyBudget?: number;
}) {
  return {
    id: String(campaign.campaignId),
    name: campaign.campaignName ?? `campaign-${campaign.campaignId}`,
    status: campaign.userStatus ?? "UNKNOWN",
    budget: campaign.dailyBudget ?? 0,
  };
}
