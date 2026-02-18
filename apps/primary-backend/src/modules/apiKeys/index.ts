import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { ApiKeyService } from "./service";
import { ApiKeyModel } from "./model";

export const app = new Elysia({ prefix: "api-keys" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
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
        "/",
        async ({ userId, body, status }) => {
            try {
                const res = await ApiKeyService.createApiKey(userId, body.name);
                return status(201, res);
            } catch (error) {
                return status(400, {
                    message: "unable to create new api.",
                });
            }
        },
        {
            body: ApiKeyModel.createApiKeyModel,
            response: {
                201: ApiKeyModel.createApiKeyResponse,
                400: ApiKeyModel.createApiKeyError,
            },
        },
    )
    .get(
        "/",
        async ({ userId, status }) => {
            try {
                const res = await ApiKeyService.getApiKeys(userId);
                return status(200, res);
            } catch (error) {
                return status(400, { message: "unable to get api keys" });
            }
        },
        {
            response: {
                200: ApiKeyModel.getApiKeysResponseSchema,
                400: ApiKeyModel.getApiKeysResponseErrorSchema,
            },
        },
    )
    .post(
        "/enable",
        async ({ userId, status, body }) => {
            try {
                const updated = await ApiKeyService.enableApiKey(
                    userId,
                    body.id,
                );
                if (updated) {
                    return status(200, {
                        message: "Enabled api key successfully",
                    });
                } else {
                    return status(411, {
                        message: "Unable to enable the api",
                    });
                }
            } catch (error) {
                console.log(error);
                return status(411, { message: "Unable to enable the api" });
            }
        },
        {
            body: ApiKeyModel.enableApiKeySchema,
            response: {
                200: ApiKeyModel.enableApiKeyResponseSchema,
                411: ApiKeyModel.enableApiKeyErrorSchema,
            },
        },
    )
    .post(
        "/disable",
        async ({ userId, status, body }) => {
            try {
                const updated = await ApiKeyService.disableApiKey(
                    userId,
                    body.id,
                );
                if (updated) {
                    return status(200, {
                        message: "Disabled api key successfully",
                    });
                } else {
                    return status(411, {
                        message: "Unable to disable the api",
                    });
                }
            } catch (error) {
                console.log(error);
                return status(411, { message: "Unable to disable the api" });
            }
        },
        {
            body: ApiKeyModel.disableApiKeySchema,
            response: {
                200: ApiKeyModel.disableApiKeyResponseSchema,
                411: ApiKeyModel.disableApiKeyErrorSchema,
            },
        },
    )
    .delete(
        "/delete",
        async ({ userId, status, body }) => {
            try {
                const updated = await ApiKeyService.deleteApiKey(
                    userId,
                    body.id,
                );
                if (updated) {
                    return status(200, {
                        message: "api key deleted successfully",
                    });
                } else {
                    return status(411, {
                        message: "unable to delete api key",
                    });
                }
            } catch (error) {
                console.log(error);
                return status(411, { message: "unable to delete api key" });
            }
        },
        {
            body: ApiKeyModel.deleteApiKeySchema,
            response: {
                200: ApiKeyModel.deleteApiKeyResponseSchema,
                411: ApiKeyModel.deleteApiKeyErrorSchema,
            },
        },
    );
