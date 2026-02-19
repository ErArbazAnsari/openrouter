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
    )
    .get(
        "/verify",
        async ({ cookie: { auth }, jwt }) => {
            try {
                if (!auth.value || typeof auth.value !== "string") {
                    return { authenticated: false, userId: null };
                }
                const payload = await jwt.verify(auth.value);
                if (payload && payload.userId) {
                    return {
                        authenticated: true,
                        userId: String(payload.userId),
                    };
                }
                return { authenticated: false, userId: null };
            } catch (error) {
                return { authenticated: false, userId: null };
            }
        },
        {
            response: {
                200: AuthModel.verifyResponseSchema,
            },
        },
    )
    .post(
        "/logout",
        async ({ cookie: { auth } }) => {
            auth.set({
                value: "",
                httpOnly: true,
                maxAge: 0,
            });
            return { message: "logged out successfully" };
        },
        {
            response: {
                200: AuthModel.logoutResponseSchema,
            },
        },
    );
