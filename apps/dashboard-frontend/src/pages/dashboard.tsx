import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useElysiaClient } from '@/providers/Eden'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface UserProfile {
    id: string
    email: string
    credits: number
    createdAt?: Date
}

interface ApiKeySummary {
    total: number
    active: number
}

export const Dashboard = () => {
    const navigate = useNavigate()
    const elysiaClient = useElysiaClient()

    // Fetch user profile
    const { data: profile, isLoading: profileLoading, error: profileError } = useQuery<UserProfile>({
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

    // Fetch API keys
    const { data: apiKeys = [], isLoading: apiKeysLoading, error: apiKeysError } = useQuery<any[]>({
        queryKey: ['api-keys'],
        queryFn: async () => {
            const response = await elysiaClient["api-keys"].get()
            if (response.error) {
                throw new Error('Failed to fetch API keys')
            }
            return response.data || []
        },
        retry: 1,
    })

    const getApiKeySummary = (): ApiKeySummary => {
        const validKeys = apiKeys.filter((k) => !k.isDisabled)
        return {
            total: apiKeys.length,
            active: validKeys.length,
        }
    }

    const apiKeySummary = getApiKeySummary()
    const totalCreditsUsed = apiKeys.reduce((sum, key) => sum + (key.creditsConsumed || 0), 0)

    if (profileLoading || apiKeysLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">Welcome to your OpenRouter dashboard, {profile?.email}</p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* API Usage Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>API Usage</CardTitle>
                            <CardDescription>This month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{totalCreditsUsed.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground mt-2">Credits used</p>
                        </CardContent>
                    </Card>

                    {/* Credits Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Credits Balance</CardTitle>
                            <CardDescription>Available credits</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">${(profile?.credits || 0).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground mt-2">Credit balance</p>
                        </CardContent>
                    </Card>

                    {/* API Keys Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>Active keys</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{apiKeySummary.active}/{apiKeySummary.total}</p>
                            <p className="text-sm text-muted-foreground mt-2">Active API keys</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Manage your account and resources</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4 flex-wrap">
                        <Button onClick={() => navigate('/apikeys')} variant="default">
                            Manage API Keys
                        </Button>
                        <Button onClick={() => navigate('/credits')} variant="outline">
                            Add Credits
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent API Activity</CardTitle>
                        <CardDescription>Your API key usage</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {apiKeys && apiKeys.length > 0 ? (
                            <div className="space-y-4">
                                {apiKeys.slice(0, 5).map((key) => (
                                    <div key={key.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                        <div>
                                            <p className="font-medium">{key.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {key.lastUsed
                                                    ? `Last used: ${new Date(key.lastUsed).toLocaleDateString()}`
                                                    : 'Never used'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{key.creditsConsumed.toFixed(2)} credits</p>
                                            <p className={`text-sm mt-1 ${key.isDisabled ? 'text-red-600' : 'text-green-600'}`}>
                                                {key.isDisabled ? 'Disabled' : 'Active'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No API keys created yet</p>
                                <Button onClick={() => navigate('/apikeys')} variant="outline">
                                    Create your first API key
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
