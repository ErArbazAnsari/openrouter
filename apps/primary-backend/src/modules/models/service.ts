import { prisma } from "db";

export abstract class ModelsService {
    static async getModels(): Promise<
        {
            id: string;
            name: string;
            slug: string;
            company: {
                id: string;
                name: string;
                website: string;
            };
        }[]
    > {
        const models = await prisma.model.findMany({
            include: {
                company: true,
            },
        });

        return models.map((model) => ({
            id: model.id.toString(),
            name: model.name,
            slug: model.slug,
            company: {
                id: model.company.id.toString(),
                name: model.company.name,
                website: model.company.website,
            },
        }));
    }

    static async getModelById(modelId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        company: {
            id: string;
            name: string;
            website: string;
        };
        providers: {
            id: string;
            name: string;
            website: string;
            inputTokenCost: number;
            outputTokenCost: number;
        }[];
    }> {
        const model = await prisma.model.findUnique({
            where: {
                id: parseInt(modelId),
            },
            include: {
                company: true,
                modelProviderMappings: {
                    include: {
                        provider: true,
                    },
                },
            },
        });

        if (!model) {
            throw new Error("Model not found");
        }

        return {
            id: model.id.toString(),
            name: model.name,
            slug: model.slug,
            company: {
                id: model.company.id.toString(),
                name: model.company.name,
                website: model.company.website,
            },
            providers: model.modelProviderMappings.map((mapping) => ({
                id: mapping.provider.id.toString(),
                name: mapping.provider.name,
                website: mapping.provider.website,
                inputTokenCost: mapping.inputTokenCost,
                outputTokenCost: mapping.outputTokenCost,
            })),
        };
    }

    static async getProviders(): Promise<
        {
            id: string;
            name: string;
            website: string;
        }[]
    > {
        const providers = await prisma.provider.findMany();

        return providers.map((provider) => ({
            id: provider.id.toString(),
            name: provider.name,
            website: provider.website,
        }));
    }

    static async getModelProviderMappings(): Promise<
        {
            id: string;
            modelId: string;
            modelName: string;
            providerId: string;
            providerName: string;
            inputTokenCost: number;
            outputTokenCost: number;
        }[]
    > {
        const mappings = await prisma.modelProviderMapping.findMany({
            include: {
                model: true,
                provider: true,
            },
        });

        return mappings.map((mapping) => ({
            id: mapping.id.toString(),
            modelId: mapping.model.id.toString(),
            modelName: mapping.model.name,
            providerId: mapping.provider.id.toString(),
            providerName: mapping.provider.name,
            inputTokenCost: mapping.inputTokenCost,
            outputTokenCost: mapping.outputTokenCost,
        }));
    }

    static async getModelProviders(modelId: string): Promise<
        {
            id: string;
            providerId: string;
            providerName: string;
            inputTokenCost: number;
            outputTokenCost: number;
        }[]
    > {
        const mappings = await prisma.modelProviderMapping.findMany({
            where: {
                modelId: parseInt(modelId),
            },
            include: {
                provider: true,
            },
        });

        return mappings.map((mapping) => ({
            id: mapping.id.toString(),
            providerId: mapping.provider.id.toString(),
            providerName: mapping.provider.name,
            inputTokenCost: mapping.inputTokenCost,
            outputTokenCost: mapping.outputTokenCost,
        }));
    }
}
