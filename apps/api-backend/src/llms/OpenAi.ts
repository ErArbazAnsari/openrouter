import { Message } from "../types";
import { BaseLLM, LLMResponse } from "./Base";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export class OpenAi extends BaseLLM {
    static async chat(
        modelSlug: string,
        messages: Message[],
    ): Promise<LLMResponse> {
        try {
            // Corrected API call structure for OpenAI SDK v4+
            const response = await client.chat.completions.create({
                model: modelSlug,
                messages: messages.map((msg) => ({
                    role: msg.role === "model" ? "assistant" : "user",
                    content: msg.content,
                })),
            });

            if (!response.choices[0]?.message?.content) {
                throw new Error("Empty response from OpenAI API");
            }

            return {
                inputTokenConsumed: response.usage?.prompt_tokens!,
                outputTokenConsumed: response.usage?.completion_tokens!,
                completions: {
                    message: {
                        content: response.choices[0].message.content,
                    },
                },
            };
        } catch (error) {
            console.error("Open API error:", error);
            throw new Error(
                `Failed to generate content: ${error instanceof Error ? error.message : "Unknown error"}`,
            );
        }
    }
}
