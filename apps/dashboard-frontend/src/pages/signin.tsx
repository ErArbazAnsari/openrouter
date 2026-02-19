import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useElysiaClient } from "@/providers/Eden"
import { useAuth } from "@/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"

const Signin = () => {
    const navigate = useNavigate()
    const elysiaClient = useElysiaClient()
    const { isAuthenticated, isLoading: authLoading } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate("/dashboard", { replace: true })
        }
    }, [isAuthenticated, authLoading, navigate])

    const signinMutation = useMutation({
        mutationFn: async () => {
            const response = await elysiaClient.auth["sign-in"].post({ email, password })
            if (response.error) {
                throw new Error(response.error?.value?.message || "Login failed")
            }
            return response.data
        },
        onSuccess: (data) => {
            setEmail("")
            setPassword("")
            toast.success(data?.message || "Signed in successfully")
            navigate("/dashboard")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        signinMutation.mutate()
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Checking authentication...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <CardTitle className="text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Sign in to your OpenRouter account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={signinMutation.isPending}
                            className="w-full"
                            size="lg"
                        >
                            {signinMutation.isPending ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <a href="/signup" className="text-primary hover:underline font-medium">
                            Sign Up
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Signin