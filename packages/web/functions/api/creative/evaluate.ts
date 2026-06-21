import {
  createProvider,
  evaluateCreative,
  isModelKind,
} from "@start-x-work/marketing-os-ads-core";
import { resolveApiKey, type AiKeyRequest } from "../../_ai-key";
import { type Env, jsonError, readJson } from "../../_shared";

interface EvaluateBody extends AiKeyRequest {
  text?: string;
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
    const apiKey = resolveApiKey(body, env, model);
    const result = await evaluateCreative(createProvider(model, apiKey), text);
    return Response.json(result);
  } catch (error) {
    return jsonError(error, "Creative evaluation failed");
  }
};
