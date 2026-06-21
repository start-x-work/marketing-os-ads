import {
  createProvider,
  evaluateCreative,
  isModelKind,
} from "@start-x-work/marketing-os-ads-core";
import { type Env, jsonError, readJson } from "../../_shared";

interface EvaluateBody {
  text?: string;
  model?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await readJson<EvaluateBody>(request);
    const text = body.text?.trim();
    if (!text) {
      throw new Error("text is required");
    }
    const model = body.model ?? "gemini";
    if (!isModelKind(model)) {
      throw new Error("Invalid model");
    }
    const apiKey =
      model === "openai"
        ? env.OPENAI_API_KEY
        : model === "anthropic"
          ? env.ANTHROPIC_API_KEY
          : env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(`${model} API key is not configured`);
    }
    const result = await evaluateCreative(createProvider(model, apiKey), text);
    return Response.json(result);
  } catch (error) {
    return jsonError(error, "Creative evaluation failed");
  }
};
