/**
 * Public API for @start-x-work/marketing-os-ads-core v0.1+
 */
export {
  AIError,
  CliError,
  COMMERCIAL_HINT,
  createProvider,
  FetchError,
  isModelKind,
  type ModelKind,
  render as renderOutput,
} from "@start-x-work/mos-kit";
export {
  type Decision,
  type DecisionInput,
  DecisionSchema,
  recordDecision,
} from "./campaign/decision-log";
export {
  analyzeStructure,
  type CampaignStructure,
} from "./campaign/structure";
export {
  type CreativeEval,
  CreativeEvalSchema,
  evaluateCreative,
} from "./creative/evaluate";
export type {
  AdGroupInput,
  AdPlatform,
  Campaign,
  CampaignInput,
  CampaignMetrics,
} from "./platforms/provider";
export {
  createYahooAdsPlatform,
  createYahooAdsPlatformFromEnv,
  type YahooAdsConfig,
} from "./platforms/yahoo";
