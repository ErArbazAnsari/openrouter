import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useElysiaClient } from '@/providers/Eden'
import { toast } from 'react-toastify'

interface UserProfile {
    id: string
    email: string
    credits: number
    createdAt?: Date
}

interface Transaction {
    id: string
    amount: number
    status: string
    createdAt: Date
}

const Credits = () => {
    const [isAddingCredits, setIsAddingCredits] = useState(false)
    const elysiaClient = useElysiaClient()
    const queryClient = useQueryClient()

    // Fetch user profile
    const { data: profile, isLoading: profileLoading } = useQuery<UserProfile>({
        queryKey: ['user-profile'],
        queryFn: async () => {
            const response = await elysiaClient.auth.profile.get()
            if (response.error) {
                throw new Error('Failed to fetch profile')
            }
            return response.data
        },
        retry: 1,
    })

    // Add credits mutation
    const addCreditsMutation = useMutation({
        mutationFn: async () => {
            const response = await elysiaClient.payments["on-ramp"].post({})
            if (response.error) {
                throw new Error('Failed to add credits')
            }
            return response.data
        },
        onSuccess: (data) => {
            toast.success(`Successfully added $${(data.amount / 100).toFixed(2)} credits!`)
            queryClient.invalidateQueries({ queryKey: ['user-profile'] })
            setIsAddingCredits(false)
        },
        onError: (error) => {
            toast.error('Failed to add credits. Please try again.')
        },
    })

    const handleAddCredits = async () => {
        addCreditsMutation.mutate()
    }

    if (profileLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading credits...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Credits</h1>
                    <p className="text-muted-foreground mt-2">Manage and track your credits</p>
                </div>

                {/* Credits Balance Card */}
                <Card className="mb-8 border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle>Current Balance</CardTitle>
                        <CardDescription>Your available credits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between flex-col md:flex-row gap-8">
                            <div>
                                <p className="text-6xl font-bold">${(profile?.credits || 0).toFixed(2)}</p>
                                <p className="text-muted-foreground mt-2">Available credits</p>
                            </div>
                            <Button
                                size="lg"
                                onClick={handleAddCredits}
                                disabled={addCreditsMutation.isPending}
                            >
                                {addCreditsMutation.isPending ? 'Adding Credits...' : '+ Add $10 Credits'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Credit Usage Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Monthly Usage</CardTitle>
                            <CardDescription>This month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">Coming Soon</p>
                            <p className="text-sm text-muted-foreground mt-2">Track upcoming usage</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Spending Limit</CardTitle>
                            <CardDescription>Monthly limit</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">Unlimited</p>
                            <p className="text-sm text-muted-foreground mt-2">No spending limits</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Account Status</CardTitle>
                            <CardDescription>Your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">Active</p>
                            <p className="text-sm text-muted-foreground mt-2">Account is active</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Transaction History */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your credit top-ups and usage history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">No transactions yet.</p>
                            <p className="text-sm text-muted-foreground">Your credit transactions will appear here.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Information */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Pricing Information</CardTitle>
                        <CardDescription>How credits are calculated</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-base mb-2">Credit Calculation</h3>
                                <p className="text-sm text-muted-foreground">
                                    Credits are consumed based on your API usage. Different models and providers have different
                                    pricing rates. Check the model details page to see pricing for each model.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-2">Adding Credits</h3>
                                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                    <li>Each purchase adds $10 worth of credits to your account</li>
                                    <li>Credits never expire</li>
                                    <li>Unused credits are available for future use</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-base mb-2">Billing</h3>
                                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                    <li>Pay-as-you-go pricing model</li>
                                    <li>No monthly subscription required</li>
                                    <li>Only pay for what you use</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* API Pricing Models */}
                <Card>
                    <CardHeader>
                        <CardTitle>Popular Models &amp; Pricing</CardTitle>
                        <CardDescription>Example pricing for common models</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 text-sm font-medium">Model</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium">Input (per 1M tokens)</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium">Output (per 1M tokens)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border hover:bg-muted/50">
                                        <td className="py-3 px-4 font-medium">GPT-3.5 Turbo</td>
                                        <td className="py-3 px-4 text-sm">$0.50</td>
                                        <td className="py-3 px-4 text-sm">$1.50</td>
                                    </tr>
                                    <tr className="border-b border-border hover:bg-muted/50">
                                        <td className="py-3 px-4 font-medium">GPT-4</td>
                                        <td className="py-3 px-4 text-sm">$30</td>
                                        <td className="py-3 px-4 text-sm">$60</td>
                                    </tr>
                                    <tr className="border-b border-border hover:bg-muted/50">
                                        <td className="py-3 px-4 font-medium">Claude 3 Opus</td>
                                        <td className="py-3 px-4 text-sm">$15</td>
                                        <td className="py-3 px-4 text-sm">$75</td>
                                    </tr>
                                    <tr className="hover:bg-muted/50">
                                        <td className="py-3 px-4 font-medium">Gemini Pro</td>
                                        <td className="py-3 px-4 text-sm">$0.50</td>
                                        <td className="py-3 px-4 text-sm">$1.50</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Credits
