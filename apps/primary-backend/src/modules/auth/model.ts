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
}
