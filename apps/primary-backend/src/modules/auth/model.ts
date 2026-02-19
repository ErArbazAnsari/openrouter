import { t } from "elysia";

export namespace AuthModel {
    export const signInSchema = t.Object({
        email: t.String(),
        password: t.String(),
    });
    export type signInSchema = typeof signInSchema.static;

    export const signInResponseSchema = t.Object({
        message: t.Literal("signed in successfully"),
    });
    export type signInResponseSchema = typeof signInResponseSchema.static;

    export const signInFailedSchema = t.Object({
        message: t.Literal("Invalid credentials"),
    });
    export type signInFailedSchema = typeof signInFailedSchema.static;

    export const signUpSchema = t.Object({
        email: t.String(),
        password: t.String(),
    });
    export type signUpSchema = typeof signInSchema.static;

    export const signUpResponseSchema = t.Object({
        id: t.String(),
    });
    export type signUpResponseSchema = typeof signInResponseSchema.static;

    export const signUpFailedResponseSchema = t.Object({
        message: t.Literal("Unable to create your account"),
    });
    export type signUpFailedResponseSchema =
        typeof signUpFailedResponseSchema.static;

    export const verifyResponseSchema = t.Object({
        authenticated: t.Boolean(),
        userId: t.Nullable(t.String()),
    });
    export type verifyResponseSchema = typeof verifyResponseSchema.static;

    export const logoutResponseSchema = t.Object({
        message: t.Literal("logged out successfully"),
    });
    export type logoutResponseSchema = typeof logoutResponseSchema.static;

    export const profileResponseSchema = t.Object({
        id: t.String(),
        email: t.String(),
        credits: t.Number(),
        createdAt: t.Optional(t.Date()),
    });
    export type profileResponseSchema = typeof profileResponseSchema.static;

    export const profileErrorSchema = t.Object({
        message: t.Literal("Unable to fetch profile"),
    });
    export type profileErrorSchema = typeof profileErrorSchema.static;

    export const profileErrorSchemaUnauth = t.Object({
        message: t.Literal("Unable to fetch profile"),
    });
    export type profileErrorSchemaUnauth = typeof profileErrorSchemaUnauth.static;
}
