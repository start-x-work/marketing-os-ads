import { defineCommand } from "citty";

export default defineCommand({
  meta: {
    name: "platform",
    description: "Read-only ad platform integrations",
  },
  subCommands: {
    yahoo: () => import("./platform/yahoo").then((m) => m.default),
  },
});
