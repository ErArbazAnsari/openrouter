import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const ApiKeys = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground mt-2">Manage your API keys and permissions</p>
          </div>
          <Button>Create New Key</Button>
        </div>

        {/* API Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>Active API keys associated with your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground">No API keys created yet</p>
              <Button variant="outline" className="mt-4">Create your first API key</Button>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Get started with the OpenRouter API</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Check out our documentation to learn how to use the API.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ApiKeys
