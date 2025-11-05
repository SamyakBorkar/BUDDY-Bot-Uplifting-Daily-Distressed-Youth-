// src/services/ai.js
import { pipeline } from "@xenova/transformers";

/*
  This file lazy-loads the pipelines so model files download only when needed.
  Two helpers:
   - analyzeMood(text): sentiment-analysis -> { label, score }
   - generateAdvice(prompt): text-generation -> string
*/

let sentimentPipeline = null;
let genPipeline = null;

export async function analyzeMood(text) {
  if (!text || !text.trim()) throw new Error("Text is required for analysis");
  try {
    if (!sentimentPipeline) {
      // small sentiment model — suitable for browser
      sentimentPipeline = await pipeline(
        "sentiment-analysis",
        "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
      );
    }
    const result = await sentimentPipeline(text);
    // result example: [{ label: "POSITIVE", score: 0.99 }]
    return Array.isArray(result) ? result[0] : result;
  } catch (err) {
    console.error("analyzeMood error:", err);
    throw err;
  }
}

export async function generateAdvice(prompt) {
  if (!prompt || !prompt.trim()) return "";
  try {
    if (!genPipeline) {
      // lightweight generator
      genPipeline = await pipeline("text-generation", "Xenova/distilgpt2");
    }
    // generate a short reply (tune max_new_tokens if needed)
    const out = await genPipeline(prompt, { max_new_tokens: 50 });
    // out might be array with generated_text
    if (Array.isArray(out) && out[0] && out[0].generated_text) {
      return out[0].generated_text;
    }
    if (out && out.generated_text) return out.generated_text;
    return String(out).slice(0, 1000);
  } catch (err) {
    console.error("generateAdvice error:", err);
    return "";
  }
}
