import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { AuthService } from "./service";
import jwt from "@elysiajs/jwt";

export const app = new Elysia({ prefix: "auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
        }),
    )
    .post(
        "/sign-up",
        async ({ body, status }) => {
            try {
                const userId = await AuthService.singup(
                    body.email,
                    body.password,
                );
                return {
                    id: userId,
                };
            } catch (error) {
                return status(400, {
                    message: "Unable to create your account",
                });
            }
        },
        {
            body: AuthModel.signUpSchema,
            response: {
                200: AuthModel.signUpResponseSchema,
                400: AuthModel.signUpFailedResponseSchema,
            },
        },
    )
    .post(
        "/sign-in",
        async ({ body, status, cookie: { auth }, jwt }) => {
            const { isValidCredentail, userId } = await AuthService.signin(
                body.email,
                body.password,
            );
            if (isValidCredentail && userId) {
                const token = await jwt.sign({ userId });
                auth.set({
                    value: token,
                    httpOnly: true,
                    maxAge: 7 * 86400,
                });
                return { message: "signed in successfully" };
            } else {
                return status(403, { message: "Invalid credentials" });
            }
        },
        {
            body: AuthModel.signInSchema,
            response: {
                200: AuthModel.signInResponseSchema,
                403: AuthModel.signInFailedSchema,
            },
        },
    );
