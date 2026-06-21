import {
  CliError,
  isModelKind,
  type ModelKind,
} from "@start-x-work/marketing-os-ads-core";

export const formatArg = {
  type: "string" as const,
  default: "table",
  description: "json, table, or markdown",
};

export const quietArg = {
  type: "boolean" as const,
  default: false,
  description: "Suppress the commercial footer line",
};

export const modelArg = {
  type: "string" as const,
  default: "gemini",
  description: "AI model: gemini, openai, or anthropic",
};

export function parseModel(value: unknown): ModelKind {
  const model = String(value ?? "gemini");
  if (!isModelKind(model)) {
    throw new CliError(
      `Invalid model "${model}". Use gemini, openai, or anthropic.`,
      "E_INPUT",
    );
  }
  return model;
}

export function parseQuiet(value: unknown): boolean {
  return value === true || value === "true";
}
