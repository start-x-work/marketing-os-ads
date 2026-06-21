import { defineCommand } from "citty";

export const subCommands = {
  campaign: () => import("./commands/campaign").then((m) => m.default),
  creative: () => import("./commands/creative").then((m) => m.default),
};

export default defineCommand({
  meta: { name: "ads", description: "Marketing-OS Ads toolkit" },
  subCommands,
});
