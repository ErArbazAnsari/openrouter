import { Message } from "../types";
import { BaseLLM, LLMResponse } from "./Base";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export class Gemini extends BaseLLM {
    static async chat(slug: string, messages: Message[]): Promise<LLMResponse> {
        try {
            // Convert messages to Gemini format
            const contents = messages.map((msg) => ({
                role: msg.role,
                text: msg.content,
            }));

            const response = await ai.models.generateContent({
                model: slug,
                contents: contents,
            });

            if (!response.text) {
                throw new Error("Empty response from Gemini API");
            }
            return {
                inputTokenConsumed: response.usageMetadata?.promptTokenCount!,
                outputTokenConsumed:
                    response.usageMetadata?.candidatesTokenCount!,
                completions: {
                    message: {
                        content: response.text,
                    },
                },
            };
        } catch (error) {
            console.error("Gemini API error:", error);
            throw new Error(
                `Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }
}
