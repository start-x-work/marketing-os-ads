import { CliError } from "@start-x-work/mos-kit";

export class ParseError extends CliError {
  constructor(detail: string) {
    super(`Failed to parse provider response: ${detail}`, "E_PARSE");
  }
}

export function parseJsonFromText<T>(text: string): T {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fenced?.[1]?.trim() ?? trimmed;
  try {
    return JSON.parse(jsonText) as T;
  } catch (error) {
    throw new ParseError(
      error instanceof Error ? error.message : "invalid JSON",
    );
  }
}
