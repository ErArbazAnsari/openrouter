import { treaty } from "@elysiajs/eden";
import type { App } from "primary-backend";
import { createContext, useContext, type ReactNode } from "react";

type EdenClient = ReturnType<typeof treaty<App>>;

const client = treaty<App>('http://localhost:3000', {
    fetch: {
        credentials: 'include',
    },
});

const ElysiaClientContext = createContext<EdenClient | undefined>(undefined);

export const ElysiaClientContextProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ElysiaClientContext.Provider value={client}>
            {children}
        </ElysiaClientContext.Provider>
    );
};

export const useElysiaClient = (): EdenClient => {
    const context = useContext(ElysiaClientContext);
    if (!context) {
        throw new Error('useElysiaContext must be used within ElysiaClientContextProvider');
    }
    return context;
};