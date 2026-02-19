import cors from "@elysiajs/cors";
import { Elysia, t } from "elysia";
import { conversation } from "./types";
import { Gemini } from "./llms/Gemini";
import jwt from "@elysiajs/jwt";
import { OpenAi } from "./llms/OpenAi";
import { Claude } from "./llms/Claude";
import { prisma } from "db";
import { LLMResponse } from "./llms/Base";

const app = new Elysia()
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
        }),
    )
    .use(
        cors({
            origin: process.env.ORIGIN_URL!,
            credentials: true,
        }),
    )
    .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth) {
            return status(401);
        }
        const decoded = await jwt.verify(auth.value as string);
        if (!decoded || !decoded.userId) {
            return status(401);
        }
        return { userId: decoded.userId as string };
    })
    .post(
        "/api/v1/chat/completions",
        async ({ headers, body, set, status }) => {
            try {
                const key = headers.authorization?.split(" ")[1];
                const isValidApi = await prisma.apiKey.findFirst({
                    where: {
                        apiKey: key,
                        disable: false,
                        deleted: false,
                    },
                    select: {
                        id: true,
                        userId: true,
                        user: true,
                    },
                });
                if (!isValidApi) {
                    return status(403, { error: "Invalid api key" });
                }
                if (isValidApi.user.credits <= 0) {
                    return status(403, {
                        error: "Not enough credits in your account",
                    });
                }
                const [company, slug] = body.model.split("/");

                // Fetch the model and its available providers
                const modelDb = await prisma.model.findFirst({
                    where: {
                        slug,
                    },
                });

                if (!modelDb) {
                    return status(403, {
                        error: "Sorry we don't support this model yet",
                    });
                }
                // Get all providers that support this model
                const providers = await prisma.modelProviderMapping.findMany({
                    where: {
                        modelId: modelDb.id,
                    },
                    include: {
                        provider: true,
                    },
                });
                if (providers.length === 0) {
                    return status(403, {
                        error: "No context providers available for this model",
                    });
                }

                // Select a random provider
                const randomProviderMap =
                    providers[Math.floor(Math.random() * providers.length)];
                const selectedProvider = randomProviderMap.provider;

                let response: LLMResponse;

                // Route to the specific LLM implementation based on the selected provider's name or logic
                // Assuming provider.name maps to your LLM classes or using a switch case
                switch (selectedProvider.name.toLowerCase()) {
                    case "google":
                        response = await Gemini.chat(slug, body.messages);
                        break;
                    case "openai":
                        response = await OpenAi.chat(slug, body.messages);
                        break;
                    case "anthropic":
                        response = await Claude.chat(slug, body.messages);
                        break;
                    default:
                        // Fallback or specific handling if provider name doesn't match class strictly
                        if (company === "gemini")
                            response = await Gemini.chat(slug, body.messages);
                        else if (company === "openai")
                            response = await OpenAi.chat(slug, body.messages);
                        else if (company === "anthropic")
                            response = await Claude.chat(slug, body.messages);
                        else
                            return status(500, {
                                error: "Provider implementation not found",
                            });
                }

                const inputTokens = Number(response.inputTokenConsumed);
                const outputTokens = Number(response.outputTokenConsumed);

                // Temporary cost calculation: (input + output) * 2
                const totalCost = (inputTokens + outputTokens) * 2;

                // Transaction: Deduct credits and Log usage
                await prisma.$transaction(async (tx) => {
                    // 1. Deduct credits from User
                    await tx.user.update({
                        where: {
                            id: isValidApi.userId,
                        },
                        data: {
                            credits: {
                                decrement: totalCost,
                            },
                        },
                    });

                    // 2. Log API Request / Usage in Conversation table
                    await tx.conversation.create({
                        data: {
                            userId: isValidApi.userId,
                            apiKeyId: isValidApi.id,
                            modelProviderMappingId: randomProviderMap.id,
                            input: JSON.stringify(body.messages),
                            output: JSON.stringify(response.completions),
                            inputTokenCount: inputTokens,
                            outputTokenCount: outputTokens,
                            totalCreditsConsumed: totalCost,
                        },
                    });
                });

                return response;
            } catch (error) {
                console.error("Error processing request:", error);
                return status(500, { error: "Internal server error" });
            }
        },
        {
            body: conversation,
            response: {
                403: t.Object({
                    error: t.String(),
                }),
                500: t.Object({
                    error: t.String(),
                }),
            },
        },
    )
    .listen(process.env.PORT!);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
