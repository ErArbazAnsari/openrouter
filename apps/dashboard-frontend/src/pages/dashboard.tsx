import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your OpenRouter dashboard</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* API Usage Card */}
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground mt-2">Requests used</p>
            </CardContent>
          </Card>

          {/* Credits Card */}
          <Card>
            <CardHeader>
              <CardTitle>Credits Balance</CardTitle>
              <CardDescription>Available credits</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$0.00</p>
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
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground mt-2">Active keys</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest API requests</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
