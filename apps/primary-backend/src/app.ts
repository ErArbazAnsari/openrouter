import { Elysia } from "elysia";
import { app as authApp } from "./modules/auth";
import { app as apiKeyApp } from "./modules/apiKeys";
import { app as modelsApp } from "./modules/models";
import { app as paymentsApp } from "./modules/payments";
import cors from "@elysiajs/cors";

export const app = new Elysia()
    .use(
        cors({
            origin: process.env.ORIGIN_URL!,
            credentials: true,
        }),
    )
    .use(authApp)
    .use(apiKeyApp)
    .use(modelsApp)
    .use(paymentsApp);

export type App = typeof app;
