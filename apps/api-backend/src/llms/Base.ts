import { Message } from "../types";

export type LLMResponse = {
    completions: {
        message: {
            content: string;
        };
    },
    inputTokenConsumed: number,
    outputTokenConsumed: number,
};

export class BaseLLM {
    static async chat(model: string, message: Message[]): Promise<LLMResponse> {
        throw new Error("Not implemented yet!");
    }
}
