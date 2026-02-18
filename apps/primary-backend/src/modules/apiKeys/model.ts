import { t } from "elysia";

export namespace ApiKeyModel {
    export const createApiKeyModel = t.Object({
        name: t.String(),
    });

    export type createApiKeyModel = typeof createApiKeyModel.static;

    export const createApiKeyResponse = t.Object({
        id: t.String(),
        apiKey: t.String(),
    });
    export type createApiKeyResponse = typeof createApiKeyResponse.static;

    export const createApiKeyError = t.Object({
        message: t.Literal("unable to create new api."),
    });
    export type createApiKeyError = typeof createApiKeyError.static;

    export const disableApiKeySchema = t.Object({
        id: t.String(),
    });

    export type disableApiKeySchema = typeof disableApiKeySchema.static;

    export const disableApiKeyErrorSchema = t.Object({
        message: t.Literal("Unable to disable the api"),
    });

    export type disableApiKeyErrorSchema =
        typeof disableApiKeyErrorSchema.static;

    export const disableApiKeyResponseSchema = t.Object({
        message: t.Literal("Disabled api key successfully"),
    });

    export type disableApiKeyResponseSchema =
        typeof disableApiKeyResponseSchema.static;

    export const enableApiKeySchema = t.Object({
        id: t.String(),
    });

    export type enableApiKeySchema = typeof enableApiKeySchema.static;

    export const enableApiKeyErrorSchema = t.Object({
        message: t.Literal("Unable to enable the api"),
    });

    export type enableApiKeyErrorSchema = typeof enableApiKeyErrorSchema.static;

    export const enableApiKeyResponseSchema = t.Object({
        message: t.Literal("Enabled api key successfully"),
    });

    export type enableApiKeyResponseSchema =
        typeof enableApiKeyResponseSchema.static;

    export const getApiKeysResponseSchema = t.Array(
        t.Object({
            id: t.String(),
            name: t.String(),
            apiKey: t.String(),
            lastUsed: t.Nullable(t.Date()),
            creditsConsumed: t.Number(),
            isDisabled: t.Boolean(),
        }),
    );

    export type getApiKeysResponseSchema =
        typeof getApiKeysResponseSchema.static;

    export const getApiKeysResponseErrorSchema = t.Object({
        message: t.Literal("unable to get api keys"),
    });

    export type getApiKeysResponseErrorSchema =
        typeof getApiKeysResponseErrorSchema.static;

    export const deleteApiKeyResponseSchema = t.Object({
        message: t.Literal("api key deleted successfully"),
    });

    export type deleteApiKeyResponseSchema =
        typeof deleteApiKeyResponseSchema.static;

    export const deleteApiKeyErrorSchema = t.Object({
        message: t.Literal("unable to delete api key"),
    });

    export type deleteApiKeyErrorSchema = typeof deleteApiKeyErrorSchema.static;

    export const deleteApiKeySchema = t.Object({
        id: t.String(),
    });

    export type deleteApiKeySchema = typeof deleteApiKeySchema.static;
}
