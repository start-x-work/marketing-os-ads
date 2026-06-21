import { createYahooAdsPlatform } from "@start-x-work/marketing-os-ads-core";
import { jsonError, readJson } from "../../_shared";

interface CampaignsBody {
  accessToken?: string;
  accountId?: string | number;
  channel?: "search" | "display";
}

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const body = await readJson<CampaignsBody>(request);
    const accessToken = body.accessToken?.trim();
    const accountId = Number(body.accountId);
    if (!accessToken || !Number.isFinite(accountId)) {
      throw new Error("accessToken and accountId are required");
    }

    const platform = createYahooAdsPlatform({
      accessToken,
      accountId,
      channel: body.channel === "display" ? "display" : "search",
    });
    const campaigns = await platform.list();
    return Response.json({ campaigns });
  } catch (error) {
    return jsonError(error, "Yahoo Ads campaign list failed");
  }
};
