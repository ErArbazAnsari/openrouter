import { t } from "elysia";

export namespace ModelsModel {
    export const getModelsResponseSchema = t.Array(
        t.Object({
            id: t.String(),
            name: t.String(),
            slug: t.String(),
            company: t.Object({
                id: t.String(),
                name: t.String(),
                website: t.String(),
            }),
        }),
    );

    export type getModelsResponseSchema = typeof getModelsResponseSchema.static;

    export const getModelsErrorSchema = t.Object({
        message: t.Literal("unable to get models"),
    });

    export type getModelsErrorSchema = typeof getModelsErrorSchema.static;

    export const getModelByIdResponseSchema = t.Object({
        id: t.String(),
        name: t.String(),
        slug: t.String(),
        company: t.Object({
            id: t.String(),
            name: t.String(),
            website: t.String(),
        }),
        providers: t.Array(
            t.Object({
                id: t.String(),
                name: t.String(),
                website: t.String(),
                inputTokenCost: t.Number(),
                outputTokenCost: t.Number(),
            }),
        ),
    });

    export type getModelByIdResponseSchema =
        typeof getModelByIdResponseSchema.static;

    export const getProvidersResponseSchema = t.Array(
        t.Object({
            id: t.String(),
            name: t.String(),
            website: t.String(),
        }),
    );

    export type getProvidersResponseSchema =
        typeof getProvidersResponseSchema.static;

    export const getProvidersErrorSchema = t.Object({
        message: t.Literal("unable to get providers"),
    });

    export type getProvidersErrorSchema = typeof getProvidersErrorSchema.static;

    export const getModelProviderMappingsResponseSchema = t.Array(
        t.Object({
            id: t.String(),
            modelId: t.String(),
            modelName: t.String(),
            providerId: t.String(),
            providerName: t.String(),
            inputTokenCost: t.Number(),
            outputTokenCost: t.Number(),
        }),
    );

    export type getModelProviderMappingsResponseSchema =
        typeof getModelProviderMappingsResponseSchema.static;

    export const getModelProviderMappingsErrorSchema = t.Object({
        message: t.Literal("unable to get model provider mappings"),
    });

    export type getModelProviderMappingsErrorSchema =
        typeof getModelProviderMappingsErrorSchema.static;

    export const getModelProvidersResponseSchema = t.Array(
        t.Object({
            id: t.String(),
            providerId: t.String(),
            providerName: t.String(),
            inputTokenCost: t.Number(),
            outputTokenCost: t.Number(),
        }),
    );

    export type getModelProvidersResponseSchema =
        typeof getModelProvidersResponseSchema.static;

    export const getModelProvidersErrorSchema = t.Object({
        message: t.Literal("unable to get providers for this model"),
    });

    export type getModelProvidersErrorSchema =
        typeof getModelProvidersErrorSchema.static;
}
