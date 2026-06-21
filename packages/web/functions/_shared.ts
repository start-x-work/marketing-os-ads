import { CliError } from "@start-x-work/marketing-os-ads-core";

export interface Env {
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

export function jsonError(
  error: unknown,
  fallback = "Request failed",
): Response {
  const message = error instanceof Error ? error.message : fallback;
  const status =
    error instanceof CliError && error.code === "E_INPUT" ? 400 : 500;
  return Response.json({ error: message }, { status });
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new CliError("Invalid JSON body", "E_INPUT");
  }
}
