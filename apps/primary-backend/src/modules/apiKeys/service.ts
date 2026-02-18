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
            name: string;
            apiKey: string;
            lastUsed: string;
            creditsConsumed: number;
            isDisabled: boolean;
        }[]
    > {
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                userId: parseInt(userId),
            },
        });
        let res = apiKeys.map((key) => ({
            name: key.name,
            apiKey: key.apiKey,
            lastUsed: key.lastUsed ? key.lastUsed.toString() : "",
            creditsConsumed: key.creditsConsumed,
            isDisabled: key.disable,
        }));
        return res;
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
