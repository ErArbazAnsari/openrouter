import { prisma } from "db";

export abstract class PaymentsService {
    static async createOnRampTransaction(userId: string): Promise<{
        id: string;
        userId: string;
        amount: number;
        status: string;
    }> {
        const userIdInt = parseInt(userId);
        const [transaction] = await prisma.$transaction([
            prisma.onRampTransaction.create({
                data: {
                    userId: userIdInt,
                    amount: 1000,
                    status: "pending",
                },
            }),
            prisma.user.update({
                where: { id: userIdInt },
                data: { credits: { increment: 1000 } },
            }),
        ]);

        // Mark transaction as complete after successful credit addition
        const completedTransaction = await prisma.onRampTransaction.update({
            where: { id: transaction.id },
            data: { status: "complete" },
        });

        return {
            id: completedTransaction.id.toString(),
            userId: completedTransaction.userId.toString(),
            amount: completedTransaction.amount,
            status: completedTransaction.status,
        };
    }
}
