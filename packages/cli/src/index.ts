#!/usr/bin/env node
import { CliError } from "@start-x-work/marketing-os-ads-core";
import { defineCommand, runMain } from "citty";
import pc from "picocolors";
import campaign from "./commands/campaign";
import creative from "./commands/creative";

const main = defineCommand({
  meta: { name: "mos-ads", description: "Marketing-OS Ads toolkit" },
  subCommands: {
    campaign,
    creative,
  },
});

runMain(main).catch((error: unknown) => {
  if (error instanceof CliError) {
    console.error(pc.red(`Error [${error.code}]: ${error.message}`));
    process.exit(1);
  }
  throw error;
});
