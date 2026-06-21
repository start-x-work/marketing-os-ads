import { describe, expect, it } from "vitest";
import { analyzeStructure } from "./structure";

describe("analyzeStructure", () => {
  it("flags missing ad groups and budget", () => {
    const result = analyzeStructure({ name: "Brand" });
    expect(result.issues).toContain("No ad groups defined");
    expect(result.issues).toContain("Budget is zero or unset");
  });

  it("passes a well-formed campaign", () => {
    const result = analyzeStructure({
      name: "Brand",
      budget: 100000,
      adGroups: [
        { name: "Core", keywords: ["marketing"], ads: ["Try Marketing-OS"] },
      ],
    });
    expect(result.issues).toHaveLength(0);
  });
});
