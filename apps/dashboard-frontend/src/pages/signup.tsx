import type { FormEvent } from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useElysiaClient } from "@/providers/Eden"
import { useAuth } from "@/hooks/useAuth"
import { useMutation } from "@tanstack/react-query"

const Signup = () => {
    const navigate = useNavigate()
    const elysiaClient = useElysiaClient();
    const { isAuthenticated, isLoading: authLoading } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            navigate("/dashboard", { replace: true })
        }
    }, [isAuthenticated, authLoading, navigate])

    const signupMutation = useMutation({
        mutationFn: async () => {
            const response = await elysiaClient.auth["sign-up"].post({ email, password })
            if (response.error) {
                throw new Error(response.error?.value?.message || "Signup failed")
            }
            return response.data
        },
        onSuccess: () => {
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            toast.success("Account created successfully")
            navigate("/dashboard")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    async function handleSignup(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        signupMutation.mutate()
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
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                    <CardDescription>Sign up for your OpenRouter account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-6">
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
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={signupMutation.isPending}
                            className="w-full"
                            size="lg"
                        >
                            {signupMutation.isPending ? "Signing up..." : "Sign Up"}
                        </Button>
                    </form>
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <a href="/signin" className="text-primary hover:underline font-medium">
                            Sign In
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Signup
