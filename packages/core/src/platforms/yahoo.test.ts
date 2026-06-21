import { describe, expect, it, vi } from "vitest";
import { createYahooAdsPlatform } from "./yahoo";
import { fetchCampaigns } from "./yahoo-client";

vi.mock("./yahoo-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./yahoo-client")>();
  return {
    ...actual,
    fetchCampaigns: vi.fn(),
    fetchCampaignStats: vi.fn().mockResolvedValue({
      impressions: 1000,
      clicks: 50,
      cost: 12000,
      conversions: 3,
    }),
  };
});

describe("createYahooAdsPlatform", () => {
  const config = {
    accessToken: "test-token",
    accountId: 123456,
  };

  it("lists campaigns from Yahoo API", async () => {
    vi.mocked(fetchCampaigns).mockResolvedValue([
      {
        campaignId: 1,
        campaignName: "Brand",
        userStatus: "ACTIVE",
        dailyBudget: 5000,
      },
    ]);

    const platform = createYahooAdsPlatform(config);
    const campaigns = await platform.list();
    expect(campaigns).toEqual([
      {
        id: "1",
        name: "Brand",
        status: "ACTIVE",
        budget: 5000,
      },
    ]);
  });

  it("gets metrics via StatsService", async () => {
    vi.mocked(fetchCampaigns).mockResolvedValue([
      { campaignId: 9, campaignName: "Test", userStatus: "PAUSED" },
    ]);
    const platform = createYahooAdsPlatform(config);
    const metrics = await platform.getMetrics("9");
    expect(metrics).toEqual({
      campaignId: "9",
      impressions: 1000,
      clicks: 50,
      cost: 12000,
      conversions: 3,
    });
  });
});
