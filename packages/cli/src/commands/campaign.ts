import {
  analyzeStructure,
  type CampaignInput,
  CliError,
  recordDecision,
  toDecisionRecordDraft,
} from "@start-x-work/marketing-os-ads-core";
import { defineCommand } from "citty";
import pc from "picocolors";
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
        export: {
          type: "string",
          description:
            "Also output a draft in another format. Supported: decision-record",
        },
        format: formatArg,
        quiet: quietArg,
      },
      async run({ args }) {
        await runSafely(async () => {
          const input = JSON.parse(String(args.json)) as Parameters<
            typeof recordDecision
          >[0];
          const exportFormat =
            args.export === undefined ? undefined : String(args.export);
          if (
            exportFormat !== undefined &&
            exportFormat !== "decision-record"
          ) {
            throw new CliError(
              `Unsupported export format "${exportFormat}". Use decision-record.`,
              "E_INPUT",
            );
          }
          const result = recordDecision(input);
          if (exportFormat === undefined) {
            render(result, args.format, { quiet: parseQuiet(args.quiet) });
            return;
          }
          const { draft, missing } = toDecisionRecordDraft(result);
          render({ draft, missing }, args.format, {
            quiet: parseQuiet(args.quiet),
          });
          if (missing.length > 0) {
            console.error(
              pc.yellow(
                `Not filled (${missing.length}): ${missing.join(", ")}. Fill these in before validating with DecisionRecordSchema.`,
              ),
            );
          }
        });
      },
    }),
  },
});
