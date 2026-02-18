import { t } from "elysia";

export namespace PaymentsModel {
    export const onRampResponseSchema = t.Object({
        id: t.String(),
        userId: t.String(),
        amount: t.Number(),
        status: t.String(),
    });

    export type onRampResponseSchema = typeof onRampResponseSchema.static;

    export const onRampErrorSchema = t.Object({
        message: t.Literal("unable to create on-ramp transaction"),
    });

    export type onRampErrorSchema = typeof onRampErrorSchema.static;
}
