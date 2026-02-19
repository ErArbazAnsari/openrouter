import { Message } from "../types";
import { BaseLLM, LLMResponse } from "./Base";
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic({
    apiKey: process.env["ANTHROPIC_API_KEY"],
});

export class Claude extends BaseLLM {
    static async chat(
        modelSlug: string,
        messages: Message[],
    ): Promise<LLMResponse> {
        try {
            // Corrected API call structure for Anthropic
            const response = await client.messages.create({
                model: modelSlug,
                max_tokens: 1024, // Required by Anthropic API
                messages: messages.map((msg) => ({
                    role: msg.role === "model" ? "assistant" : "user",
                    content: msg.content,
                })),
            });

            if (!response?.content || response.content.length === 0) {
                throw new Error("Empty response from Anthropic API");
            }

            // Extract text from the first content block (assuming text response)
            const textContent =
                response.content[0].type === "text"
                    ? response.content[0].text
                    : "";

            return {
                inputTokenConsumed: response.usage.input_tokens,
                outputTokenConsumed: response.usage.output_tokens,
                completions: {
                    message: {
                        content: textContent,
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
