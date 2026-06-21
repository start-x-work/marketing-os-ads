import {
  createProvider,
  evaluateCreative,
} from "@start-x-work/marketing-os-ads-core";
import { defineCommand } from "citty";
import { runSafely } from "../errors";
import { render } from "../output/render";
import {
  formatArg,
  modelArg,
  parseModel,
  parseQuiet,
  quietArg,
} from "../shared";

export default defineCommand({
  meta: { name: "creative", description: "Creative evaluation tools" },
  subCommands: {
    evaluate: defineCommand({
      meta: {
        name: "evaluate",
        description: "Evaluate ad creative (no generation)",
      },
      args: {
        text: {
          type: "positional",
          required: true,
          description: "Creative text to evaluate",
        },
        format: formatArg,
        model: modelArg,
        quiet: quietArg,
      },
      async run({ args }) {
        await runSafely(async () => {
          const result = await evaluateCreative(
            createProvider(parseModel(args.model)),
            String(args.text),
          );
          render(result, args.format, { quiet: parseQuiet(args.quiet) });
        });
      },
    }),
  },
});
