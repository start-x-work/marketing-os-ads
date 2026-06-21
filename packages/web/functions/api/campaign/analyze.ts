import {
  analyzeStructure,
  type CampaignInput,
} from "@start-x-work/marketing-os-ads-core";
import { jsonError, readJson } from "../../_shared";

interface AnalyzeBody {
  campaign?: CampaignInput;
}

export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const body = await readJson<AnalyzeBody>(request);
    if (!body.campaign) {
      throw new Error("campaign is required");
    }
    return Response.json(analyzeStructure(body.campaign));
  } catch (error) {
    return jsonError(error, "Campaign analysis failed");
  }
};
