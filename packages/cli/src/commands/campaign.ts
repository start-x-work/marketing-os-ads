import {
  analyzeStructure,
  type CampaignInput,
  recordDecision,
} from "@start-x-work/marketing-os-ads-core";
import { defineCommand } from "citty";
import { runSafely } from "../errors";
import { render } from "../output/render";
import { formatArg, parseQuiet, quietArg } from "../shared";

function parseCampaignJson(raw: string): CampaignInput {
  try {
    return JSON.parse(raw) as CampaignInput;
  } catch {
    throw new Error("Invalid campaign JSON");
  }
}

export default defineCommand({
  meta: {
    name: "campaign",
    description: "Campaign structure and decision logs",
  },
  subCommands: {
    analyze: defineCommand({
      meta: { name: "analyze", description: "Analyze campaign structure" },
      args: {
        json: {
          type: "positional",
          required: true,
          description: "Campaign JSON",
        },
        format: formatArg,
        quiet: quietArg,
      },
      async run({ args }) {
        await runSafely(async () => {
          const result = analyzeStructure(parseCampaignJson(String(args.json)));
          render(result, args.format, { quiet: parseQuiet(args.quiet) });
        });
      },
    }),
    log: defineCommand({
      meta: { name: "log", description: "Record a delivery decision" },
      args: {
        json: {
          type: "positional",
          required: true,
          description: "Decision JSON (without id/timestamp)",
        },
        format: formatArg,
        quiet: quietArg,
      },
      async run({ args }) {
        await runSafely(async () => {
          const input = JSON.parse(String(args.json)) as Parameters<
            typeof recordDecision
          >[0];
          const result = recordDecision(input);
          render(result, args.format, { quiet: parseQuiet(args.quiet) });
        });
      },
    }),
  },
});
