import { useElysiaClient } from "@/providers/Eden";
import { useQuery } from "@tanstack/react-query";

interface AuthState {
    isAuthenticated: boolean;
    userId: string | null;
    isLoading: boolean;
}

export const useAuth = () => {
    const elysiaClient = useElysiaClient();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ["auth-verify"],
        queryFn: async () => {
            const response = await elysiaClient.auth.verify.get();
            if (response.error) {
                throw new Error("Failed to verify auth");
            }
            return response.data;
        },
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const authState: AuthState = {
        isAuthenticated: data?.authenticated ?? false,
        userId: data?.userId ?? null,
        isLoading,
    };

    return { ...authState, refetch };
};
