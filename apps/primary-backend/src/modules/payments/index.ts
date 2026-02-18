import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { PaymentsService } from "./service";
import { PaymentsModel } from "./model";

export const app = new Elysia({ prefix: "payments" })
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
        "/on-ramp",
        async ({ userId, status }) => {
            try {
                const res =
                    await PaymentsService.createOnRampTransaction(userId);
                return status(201, res);
            } catch (error) {
                return status(400, {
                    message: "unable to create on-ramp transaction",
                });
            }
        },
        {
            response: {
                201: PaymentsModel.onRampResponseSchema,
                400: PaymentsModel.onRampErrorSchema,
            },
        },
    );
