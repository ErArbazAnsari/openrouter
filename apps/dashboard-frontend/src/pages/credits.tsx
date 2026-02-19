import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Credits = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Credits</h1>
                    <p className="text-muted-foreground mt-2">Manage and track your credits</p>
                </div>

                {/* Credits Balance */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Current Balance</CardTitle>
                        <CardDescription>Your available credits</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-5xl font-bold">$0.00</p>
                                <p className="text-muted-foreground mt-2">Available credits</p>
                            </div>
                            <Button size="lg">Add Credits</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Credits History */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your credit usage and top-ups</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No transactions yet</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pricing Information</CardTitle>
                        <CardDescription>View our pricing tiers and rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Credits are consumed based on API usage. Check our pricing page for current rates.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Credits
