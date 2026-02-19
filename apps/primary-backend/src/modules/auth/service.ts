import { prisma } from "db";

export abstract class AuthService {
    static async singup(email: string, password: string): Promise<string> {
        const user = await prisma.user.create({
            data: { email, password: await Bun.password.hash(password) },
        });
        return user.id.toString();
    }
    static async signin(
        email: string,
        password: string,
    ): Promise<{ isValidCredentail: boolean; userId: string | null }> {
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) return { isValidCredentail: false, userId: null };

        const verify = await Bun.password.verify(password, user?.password);
        if (!verify)
            return {
                isValidCredentail: false,
                userId: null,
            };
        else {
            return { isValidCredentail: true, userId: user.id.toString() };
        }
    }

    static async getProfile(userId: string): Promise<{
        id: string;
        email: string;
        credits: number;
        createdAt?: Date;
    }> {
        const user = await prisma.user.findFirst({
            where: { id: parseInt(userId) },
        });
        if (!user) {
            throw new Error("User not found");
        }
        return {
            id: user.id.toString(),
            email: user.email,
            credits: user.credits,
            createdAt: (user as any).createdAt,
        };
    }
}
