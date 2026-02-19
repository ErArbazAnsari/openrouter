import { prisma } from "db";

export abstract class ApiKeyService {
    static async createApiKey(
        userId: string,
        name: string,
    ): Promise<{ id: string; apiKey: string }> {
        const newApiKey = crypto.randomUUID();

        const response = await prisma.apiKey.create({
            data: {
                userId: parseInt(userId),
                name,
                apiKey: newApiKey,
            },
        });

        return { id: response.id.toString(), apiKey: response.apiKey };
    }

    static async getApiKeys(userId: string): Promise<
        {
            id: string;
            name: string;
            apiKey: string;
            lastUsed: Date | null;
            creditsConsumed: number;
            isDisabled: boolean;
        }[]
    > {
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                userId: parseInt(userId),
                deleted: false, // Only fetch non-deleted keys
            },
        });
        let res = apiKeys.map((key) => ({
            id: key.id.toString(),
            name: key.name,
            apiKey: key.apiKey,
            lastUsed: key.lastUsed ? key.lastUsed : null,
            creditsConsumed: key.creditsConsumed,
            isDisabled: key.disable,
        }));
        return res;
    }

    static async enableApiKey(userId: string, apiId: string): Promise<boolean> {
        const updated = await prisma.apiKey.update({
            where: {
                id: parseInt(apiId),
                userId: parseInt(userId),
            },
            data: {
                disable: false,
            },
        });
        if (updated) return true;
        else return false;
    }

    static async disableApiKey(
        userId: string,
        apiId: string,
    ): Promise<boolean> {
        const updated = await prisma.apiKey.update({
            where: {
                id: parseInt(apiId),
                userId: parseInt(userId),
            },
            data: {
                disable: true,
            },
        });
        if (updated) return true;
        else return false;
    }

    static async deleteApiKey(userId: string, apiId: string): Promise<boolean> {
        const updated = await prisma.apiKey.update({
            where: {
                id: parseInt(apiId),
                userId: parseInt(userId),
            },
            data: {
                deleted: true,
                disable: true,
            },
        });
        if (updated) return true;
        else return false;
    }
}
