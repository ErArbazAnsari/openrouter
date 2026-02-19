import { Rocket, Lock, BarChart3, Plug, DollarSign, Handshake } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Home = () => {
    const features = [
        {
            icon: Rocket,
            title: 'Lightning Fast',
            description: 'Experience blazing fast API performance with optimized endpoints and caching.',
        },
        {
            icon: Lock,
            title: 'Secure & Reliable',
            description: 'Enterprise-grade security with end-to-end encryption and 99.99% uptime.',
        },
        {
            icon: BarChart3,
            title: 'Analytics Dashboard',
            description: 'Real-time monitoring and detailed analytics for all your API calls.',
        },
        {
            icon: Plug,
            title: 'Easy Integration',
            description: 'Simple REST API with comprehensive documentation and SDKs.',
        },
        {
            icon: DollarSign,
            title: 'Flexible Pricing',
            description: 'Pay as you go with no setup fees. Scale with your business.',
        },
        {
            icon: Handshake,
            title: '24/7 Support',
            description: 'Dedicated support team ready to help you succeed.',
        },
    ]

    const stats = [
        { value: '10M+', label: 'API Calls Daily' },
        { value: '500+', label: 'Active Developers' },
        { value: '99.99%', label: 'Uptime Guarantee' },
        { value: '50+', label: 'Countries Served' },
    ]

    return (
        <main className="w-full">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
                <div className="text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                        The Future of AI APIs
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8">
                        Access the most powerful AI models through a single, unified API. Build smarter applications with OpenRouter.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-base">
                            Start Your Free Trial
                        </Button>
                        <Button variant="outline" size="lg" className="text-base">
                            Read Documentation
                        </Button>
                    </div>
                </div>

                {/* Hero Image Placeholder */}
                <div className="mt-16 rounded-xl border border-border bg-linear-to-br from-primary/10 to-primary/5 h-96 md:h-125 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute flex items-center justify-center text-8xl font-bold tracking-wide text-[#27272a]">
                        openrouter
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-accent/30 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to build amazing applications with AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon
                        return (
                            <Card key={index} className="hover:border-primary/50 transition-colors">
                                <CardHeader>
                                    <IconComponent className="w-10 h-10 text-primary mb-4" />
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-accent/50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of developers using OpenRouter to power their applications. Start free, pay as you grow.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="text-base">
                            Create Free Account
                        </Button>
                        <Button variant="outline" size="lg" className="text-base">
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Home