import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useElysiaClient } from '@/providers/Eden'
import { toast } from 'react-toastify'

interface ApiKey {
    id: string
    name: string
    apiKey: string
    lastUsed: Date | null
    creditsConsumed: number
    isDisabled: boolean
}

const ApiKeys = () => {
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newKeyName, setNewKeyName] = useState('')
    const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)
    const [showKeyModal, setShowKeyModal] = useState(false)

    const elysiaClient = useElysiaClient()
    const queryClient = useQueryClient()

    // Fetch API keys
    const { data: apiKeys = [], isLoading, error } = useQuery<ApiKey[]>({
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

    // Create API key mutation
    const createKeyMutation = useMutation({
        mutationFn: async (name: string) => {
            const response = await elysiaClient["api-keys"].post({
                name,
            })
            if (response.error) {
                throw new Error('Failed to create API key')
            }
            return response.data
        },
        onSuccess: (data) => {
            toast.success('API key created successfully!')
            setNewKeyName('')
            setShowCreateForm(false)
            setSelectedKey(data as ApiKey)
            setShowKeyModal(true)
            queryClient.invalidateQueries({ queryKey: ['api-keys'] })
        },
        onError: (error) => {
            toast.error('Failed to create API key')
        },
    })

    // Enable API key mutation
    const enableMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await elysiaClient["api-keys"].enable.post({
                id,
            })
            if (response.error) {
                throw new Error('Failed to enable API key')
            }
            return response.data
        },
        onSuccess: () => {
            toast.success('API key enabled successfully')
            queryClient.invalidateQueries({ queryKey: ['api-keys'] })
        },
        onError: () => {
            toast.error('Failed to enable API key')
        },
    })

    // Disable API key mutation
    const disableMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await elysiaClient["api-keys"].disable.post({
                id,
            })
            if (response.error) {
                throw new Error('Failed to disable API key')
            }
            return response.data
        },
        onSuccess: () => {
            toast.success('API key disabled successfully')
            queryClient.invalidateQueries({ queryKey: ['api-keys'] })
        },
        onError: () => {
            toast.error('Failed to disable API key')
        },
    })

    // Delete API key mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await (elysiaClient["api-keys"] as any)[id].delete()
            if (response.error) {
                throw new Error('Failed to delete API key')
            }
            return response.data
        },
        onSuccess: () => {
            toast.success('API key deleted successfully')
            queryClient.invalidateQueries({ queryKey: ['api-keys'] })
        },
        onError: () => {
            toast.error('Failed to delete API key')
        },
    })

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) {
            toast.error('Please enter a key name')
            return
        }
        createKeyMutation.mutate(newKeyName)
    }

    const handleCopyKey = (key: string) => {
        navigator.clipboard.writeText(key)
        toast.success('API key copied to clipboard')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading API keys...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">API Keys</h1>
                        <p className="text-muted-foreground mt-2">Manage your API keys and permissions</p>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        disabled={createKeyMutation.isPending}
                    >
                        {showCreateForm ? 'Cancel' : 'Create New Key'}
                    </Button>
                </div>

                {/* Create New Key Form */}
                {showCreateForm && (
                    <Card className="mb-8 border-primary/50 bg-primary/5">
                        <CardHeader>
                            <CardTitle>Create New API Key</CardTitle>
                            <CardDescription>Give your API key a descriptive name</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Key Name</label>
                                    <input
                                        type="text"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        placeholder="e.g., Production API Key"
                                        className="w-full mt-2 px-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                                    />
                                </div>
                                <Button
                                    onClick={handleCreateKey}
                                    disabled={createKeyMutation.isPending}
                                    className="w-full"
                                >
                                    {createKeyMutation.isPending ? 'Creating...' : 'Create API Key'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* API Key Modal for newly created key */}
                {showKeyModal && selectedKey && (
                    <Card className="mb-8 border-green-500/50 bg-green-50 dark:bg-green-950">
                        <CardHeader>
                            <CardTitle>Your New API Key</CardTitle>
                            <CardDescription>Save this key somewhere safe. You won't be able to see it again.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-background rounded border border-input font-mono break-all text-sm">
                                    {selectedKey.apiKey}
                                </div>
                                <Button
                                    onClick={() => handleCopyKey(selectedKey.apiKey)}
                                    className="w-full"
                                >
                                    Copy to Clipboard
                                </Button>
                                <Button
                                    onClick={() => setShowKeyModal(false)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    I've Saved My Key
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* API Keys List */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Your API Keys</CardTitle>
                        <CardDescription>Manage and monitor your API keys</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {apiKeys && apiKeys.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left py-3 px-4 text-sm font-medium">Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium">Created</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium">Last Used</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium">Credits Used</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {apiKeys.map((key) => (
                                            <tr key={key.id} className="border-b border-border hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">{key.name}</td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">-</td>
                                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                                    {key.lastUsed
                                                        ? new Date(key.lastUsed).toLocaleDateString()
                                                        : 'Never'}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium">{key.creditsConsumed.toFixed(2)}</td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full ${
                                                            key.isDisabled
                                                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                                                                : 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                                                        }`}
                                                    >
                                                        {key.isDisabled ? 'Disabled' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        {key.isDisabled ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => enableMutation.mutate(key.id)}
                                                                disabled={enableMutation.isPending}
                                                            >
                                                                Enable
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => disableMutation.mutate(key.id)}
                                                                disabled={disableMutation.isPending}
                                                            >
                                                                Disable
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (
                                                                    confirm(
                                                                        'Are you sure you want to delete this API key? This action cannot be undone.'
                                                                    )
                                                                ) {
                                                                    deleteMutation.mutate(key.id)
                                                                }
                                                            }}
                                                            disabled={deleteMutation.isPending}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">No API keys created yet</p>
                                <Button onClick={() => setShowCreateForm(true)} variant="outline">
                                    Create your first API key
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* API Documentation */}
                <Card>
                    <CardHeader>
                        <CardTitle>API Usage Example</CardTitle>
                        <CardDescription>How to use your API key</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                            <pre>{`curl https://api.openrouter.com/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ApiKeys
