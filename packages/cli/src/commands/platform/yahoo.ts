import { createYahooAdsPlatform } from "@start-x-work/marketing-os-ads-core";
import { defineCommand } from "citty";
import { runSafely } from "../../errors";
import { render } from "../../output/render";
import { formatArg, parseQuiet, quietArg } from "../../shared";

function resolveYahooConfig(args: {
  "access-token"?: string;
  "account-id"?: string;
  channel?: string;
}) {
  const accessToken =
    args["access-token"]?.trim() || process.env.YAHOO_ADS_ACCESS_TOKEN?.trim();
  const accountId = Number(
    args["account-id"]?.trim() || process.env.YAHOO_ADS_ACCOUNT_ID,
  );
  if (!accessToken || !Number.isFinite(accountId)) {
    throw new Error(
      "Yahoo Ads credentials required. Set YAHOO_ADS_ACCESS_TOKEN and YAHOO_ADS_ACCOUNT_ID, or pass --access-token and --account-id.",
    );
  }
  return createYahooAdsPlatform({
    accessToken,
    accountId,
    channel: args.channel === "display" ? "display" : "search",
  });
}

const credentialArgs = {
  "access-token": {
    type: "string" as const,
    description: "Yahoo Ads OAuth access token (or YAHOO_ADS_ACCESS_TOKEN)",
  },
  "account-id": {
    type: "string" as const,
    description: "Yahoo Ads account ID (or YAHOO_ADS_ACCOUNT_ID)",
  },
  channel: {
    type: "string" as const,
    default: "search",
    description: "search or display",
  },
  format: formatArg,
  quiet: quietArg,
};

export default defineCommand({
  meta: {
    name: "yahoo",
    description: "Yahoo! Ads read-only platform (list campaigns, metrics)",
  },
  subCommands: {
    list: defineCommand({
      meta: { name: "list", description: "List campaigns" },
      args: credentialArgs,
      async run({ args }) {
        await runSafely(async () => {
          const platform = resolveYahooConfig(args);
          const campaigns = await platform.list();
          render(campaigns, args.format, { quiet: parseQuiet(args.quiet) });
        });
      },
    }),
    metrics: defineCommand({
      meta: { name: "metrics", description: "Get campaign metrics (30 days)" },
      args: {
        ...credentialArgs,
        id: {
          type: "positional" as const,
          required: true,
          description: "Campaign ID",
        },
      },
      async run({ args }) {
        await runSafely(async () => {
          const platform = resolveYahooConfig(args);
          const metrics = await platform.getMetrics(String(args.id));
          render(metrics, args.format, { quiet: parseQuiet(args.quiet) });
        });
      },
    }),
  },
});
