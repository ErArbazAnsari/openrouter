import Elysia from "elysia";
import { ModelsService } from "./service";
import { ModelsModel } from "./model";

export const app = new Elysia({ prefix: "models" })
    .get(
        "/",
        async ({ status }) => {
            try {
                const res = await ModelsService.getModels();
                return status(200, res);
            } catch (error) {
                return status(400, {
                    message: "unable to get models",
                });
            }
        },
        {
            response: {
                200: ModelsModel.getModelsResponseSchema,
                400: ModelsModel.getModelsErrorSchema,
            },
        },
    )
    .get(
        "/:modelId",
        async ({ params: { modelId }, status }) => {
            try {
                const res = await ModelsService.getModelById(modelId);
                return status(200, res);
            } catch (error) {
                return status(400, {
                    message: "unable to get models",
                });
            }
        },
        {
            response: {
                200: ModelsModel.getModelByIdResponseSchema,
                400: ModelsModel.getModelsErrorSchema,
            },
        },
    )
    .get(
        "/providers",
        async ({ status }) => {
            try {
                const res = await ModelsService.getProviders();
                return status(200, res);
            } catch (error) {
                return status(400, {
                    message: "unable to get providers",
                });
            }
        },
        {
            response: {
                200: ModelsModel.getProvidersResponseSchema,
                400: ModelsModel.getProvidersErrorSchema,
            },
        },
    )
    .get(
        "/mappings",
        async ({ status }) => {
            try {
                const res = await ModelsService.getModelProviderMappings();
                return status(200, res);
            } catch (error) {
                return status(400, {
                    message: "unable to get model provider mappings",
                });
            }
        },
        {
            response: {
                200: ModelsModel.getModelProviderMappingsResponseSchema,
                400: ModelsModel.getModelProviderMappingsErrorSchema,
            },
        },
    )
    .get(
        "/:modelId/providers",
        async ({ params: { modelId }, status }) => {
            try {
                const res = await ModelsService.getModelProviders(modelId);
                return status(200, res);
            } catch (error) {
                return status(400, {
                    message: "unable to get providers for this model",
                });
            }
        },
        {
            response: {
                200: ModelsModel.getModelProvidersResponseSchema,
                400: ModelsModel.getModelProvidersErrorSchema,
            },
        },
    );
