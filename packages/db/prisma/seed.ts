import { prisma } from "../index";

async function main() {
    console.log("🌱 Starting database seed...");

    // Clear existing data
    await prisma.conversation.deleteMany({});
    await prisma.onRampTransaction.deleteMany({});
    await prisma.apiKey.deleteMany({});
    await prisma.modelProviderMapping.deleteMany({});
    await prisma.model.deleteMany({});
    await prisma.provider.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("🗑️  Cleared existing data");

    // Create Test Users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: "test@example.com",
                password: await Bun.password.hash("password123"),
                credits: 5000,
            },
        }),
        prisma.user.create({
            data: {
                email: "developer@example.com",
                password: await Bun.password.hash("developer123"),
                credits: 10000,
            },
        }),
        prisma.user.create({
            data: {
                email: "admin@example.com",
                password: await Bun.password.hash("admin123"),
                credits: 50000,
            },
        }),
        prisma.user.create({
            data: {
                email: "john@example.com",
                password: await Bun.password.hash("john123"),
                credits: 2500,
            },
        }),
    ]);

    console.log(`✅ Created ${users.length} test users`);

    // Create Providers
    const providers = await Promise.all([
        prisma.provider.create({
            data: {
                name: "OpenAI",
                website: "https://openai.com",
            },
        }),
        prisma.provider.create({
            data: {
                name: "Anthropic",
                website: "https://anthropic.com",
            },
        }),
        prisma.provider.create({
            data: {
                name: "Google",
                website: "https://google.com",
            },
        }),
        prisma.provider.create({
            data: {
                name: "Cohere",
                website: "https://cohere.com",
            },
        }),
        prisma.provider.create({
            data: {
                name: "Meta",
                website: "https://meta.com",
            },
        }),
    ]);

    console.log(`✅ Created ${providers.length} providers`);

    // Create Companies
    const companies = await Promise.all([
        prisma.company.create({
            data: {
                name: "OpenAI",
                website: "https://openai.com",
            },
        }),
        prisma.company.create({
            data: {
                name: "Anthropic",
                website: "https://anthropic.com",
            },
        }),
        prisma.company.create({
            data: {
                name: "Google",
                website: "https://google.com",
            },
        }),
        prisma.company.create({
            data: {
                name: "Meta",
                website: "https://meta.com",
            },
        }),
        prisma.company.create({
            data: {
                name: "Cohere",
                website: "https://cohere.com",
            },
        }),
    ]);

    console.log(`✅ Created ${companies.length} companies`);

    // Create Models
    const models = await Promise.all([
        // OpenAI Models
        prisma.model.create({
            data: {
                name: "GPT-4",
                slug: "gpt-4",
                companyId: companies[0].id,
            },
        }),
        prisma.model.create({
            data: {
                name: "GPT-3.5 Turbo",
                slug: "gpt-3.5-turbo",
                companyId: companies[0].id,
            },
        }),
        prisma.model.create({
            data: {
                name: "GPT-4 Turbo",
                slug: "gpt-4-turbo",
                companyId: companies[0].id,
            },
        }),
        // Anthropic Models
        prisma.model.create({
            data: {
                name: "Claude 3 Opus",
                slug: "claude-3-opus",
                companyId: companies[1].id,
            },
        }),
        prisma.model.create({
            data: {
                name: "Claude 3 Sonnet",
                slug: "claude-3-sonnet",
                companyId: companies[1].id,
            },
        }),
        prisma.model.create({
            data: {
                name: "Claude 3 Haiku",
                slug: "claude-3-haiku",
                companyId: companies[1].id,
            },
        }),
        // Google Models
        prisma.model.create({
            data: {
                name: "Gemini Pro",
                slug: "gemini-pro",
                companyId: companies[2].id,
            },
        }),
        prisma.model.create({
            data: {
                name: "Gemini Pro Vision",
                slug: "gemini-pro-vision",
                companyId: companies[2].id,
            },
        }),
        // Meta Models
        prisma.model.create({
            data: {
                name: "Llama 2 Chat",
                slug: "llama-2-chat",
                companyId: companies[3].id,
            },
        }),
        // Cohere Models
        prisma.model.create({
            data: {
                name: "Command",
                slug: "command",
                companyId: companies[4].id,
            },
        }),
    ]);

    console.log(`✅ Created ${models.length} models`);

    // Create Model-Provider Mappings
    const mappings = await Promise.all([
        // GPT-4 with OpenAI
        prisma.modelProviderMapping.create({
            data: {
                modelId: models[0].id,
                providerId: providers[0].id,
                inputTokenCost: 3000,
                outputTokenCost: 6000,
            },
        }),
        // GPT-3.5 Turbo with OpenAI
        prisma.modelProviderMapping.create({
            data: {
                modelId: models[1].id,
                providerId: providers[0].id,
                inputTokenCost: 50,
                outputTokenCost: 150,
            },
        }),
        // Claude 3 Opus with Anthropic
        prisma.modelProviderMapping.create({
            data: {
                modelId: models[3].id,
                providerId: providers[1].id,
                inputTokenCost: 1500,
                outputTokenCost: 7500,
            },
        }),
        // Claude 3 Sonnet with Anthropic
        prisma.modelProviderMapping.create({
            data: {
                modelId: models[4].id,
                providerId: providers[1].id,
                inputTokenCost: 300,
                outputTokenCost: 1500,
            },
        }),
        // Gemini Pro with Google
        prisma.modelProviderMapping.create({
            data: {
                modelId: models[6].id,
                providerId: providers[2].id,
                inputTokenCost: 50,
                outputTokenCost: 100,
            },
        }),
        // Llama 2 Chat with Meta
        prisma.modelProviderMapping.create({
            data: {
                modelId: models[8].id,
                providerId: providers[4].id,
                inputTokenCost: 0,
                outputTokenCost: 0,
            },
        }),
    ]);

    console.log(`✅ Created ${mappings.length} model-provider mappings`);

    // Create API Keys for each user
    const apiKeys = await Promise.all([
        // User 1 API Keys
        prisma.apiKey.create({
            data: {
                userId: users[0].id,
                name: "Production API Key",
                apiKey: `sk_live_${crypto.randomUUID()}`,
                disable: false,
                creditsConsumed: 150,
                lastUsed: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            },
        }),
        prisma.apiKey.create({
            data: {
                userId: users[0].id,
                name: "Development API Key",
                apiKey: `sk_dev_${crypto.randomUUID()}`,
                disable: false,
                creditsConsumed: 45,
                lastUsed: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            },
        }),
        // User 2 API Keys
        prisma.apiKey.create({
            data: {
                userId: users[1].id,
                name: "Main API Key",
                apiKey: `sk_live_${crypto.randomUUID()}`,
                disable: false,
                creditsConsumed: 520,
                lastUsed: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
            },
        }),
        prisma.apiKey.create({
            data: {
                userId: users[1].id,
                name: "Testing Key",
                apiKey: `sk_test_${crypto.randomUUID()}`,
                disable: true,
                creditsConsumed: 200,
                lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            },
        }),
        // User 3 API Keys
        prisma.apiKey.create({
            data: {
                userId: users[2].id,
                name: "Admin API Key",
                apiKey: `sk_admin_${crypto.randomUUID()}`,
                disable: false,
                creditsConsumed: 1250,
                lastUsed: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
            },
        }),
        // User 4 API Key
        prisma.apiKey.create({
            data: {
                userId: users[3].id,
                name: "Personal Key",
                apiKey: `sk_personal_${crypto.randomUUID()}`,
                disable: false,
                creditsConsumed: 80,
                lastUsed: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            },
        }),
    ]);

    console.log(`✅ Created ${apiKeys.length} API keys`);

    // Create On-Ramp Transactions
    const transactions = await Promise.all([
        prisma.onRampTransaction.create({
            data: {
                userId: users[0].id,
                amount: 1000,
                status: "complete",
            },
        }),
        prisma.onRampTransaction.create({
            data: {
                userId: users[0].id,
                amount: 2000,
                status: "complete",
            },
        }),
        prisma.onRampTransaction.create({
            data: {
                userId: users[1].id,
                amount: 5000,
                status: "complete",
            },
        }),
        prisma.onRampTransaction.create({
            data: {
                userId: users[1].id,
                amount: 3000,
                status: "pending",
            },
        }),
        prisma.onRampTransaction.create({
            data: {
                userId: users[2].id,
                amount: 10000,
                status: "complete",
            },
        }),
        prisma.onRampTransaction.create({
            data: {
                userId: users[3].id,
                amount: 1000,
                status: "complete",
            },
        }),
    ]);

    console.log(`✅ Created ${transactions.length} on-ramp transactions`);

    // Create Conversations
    const conversations = await Promise.all([
        prisma.conversation.create({
            data: {
                userId: users[0].id,
                apiKeyId: apiKeys[0].id,
                modelProviderMappingId: mappings[1].id,
                input: "What is the capital of France?",
                output: "The capital of France is Paris.",
                inputTokenCount: 8,
                outputTokenCount: 7,
            },
        }),
        prisma.conversation.create({
            data: {
                userId: users[0].id,
                apiKeyId: apiKeys[1].id,
                modelProviderMappingId: mappings[3].id,
                input: "Explain quantum computing in simple terms",
                output: "Quantum computing uses quantum bits (qubits) that can be 0 or 1 simultaneously...",
                inputTokenCount: 7,
                outputTokenCount: 25,
            },
        }),
        prisma.conversation.create({
            data: {
                userId: users[1].id,
                apiKeyId: apiKeys[2].id,
                modelProviderMappingId: mappings[0].id,
                input: "Write a Python function to calculate factorial",
                output: "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n-1)",
                inputTokenCount: 9,
                outputTokenCount: 24,
            },
        }),
        prisma.conversation.create({
            data: {
                userId: users[1].id,
                apiKeyId: apiKeys[2].id,
                modelProviderMappingId: mappings[4].id,
                input: "What are the benefits of using TypeScript?",
                output: "TypeScript provides: 1) Type safety, 2) Better IDE support, 3) Easier refactoring...",
                inputTokenCount: 9,
                outputTokenCount: 20,
            },
        }),
        prisma.conversation.create({
            data: {
                userId: users[2].id,
                apiKeyId: apiKeys[4].id,
                modelProviderMappingId: mappings[2].id,
                input: "How do machine learning models learn?",
                output: "ML models learn through algorithms that optimize parameters based on data...",
                inputTokenCount: 8,
                outputTokenCount: 18,
            },
        }),
        prisma.conversation.create({
            data: {
                userId: users[3].id,
                apiKeyId: apiKeys[5].id,
                modelProviderMappingId: mappings[1].id,
                input: "What is blockchain?",
                output: "Blockchain is a distributed ledger technology that records transactions...",
                inputTokenCount: 4,
                outputTokenCount: 15,
            },
        }),
    ]);

    console.log(`✅ Created ${conversations.length} conversations`);

    console.log("\n📊 Seed Data Summary:");
    console.log(`   Users: ${users.length}`);
    console.log(`   Providers: ${providers.length}`);
    console.log(`   Companies: ${companies.length}`);
    console.log(`   Models: ${models.length}`);
    console.log(`   Model-Provider Mappings: ${mappings.length}`);
    console.log(`   API Keys: ${apiKeys.length}`);
    console.log(`   Transactions: ${transactions.length}`);
    console.log(`   Conversations: ${conversations.length}`);

    console.log("\n🔐 Test User Credentials:");
    console.log("   1. test@example.com / password123 (5000 credits)");
    console.log("   2. developer@example.com / developer123 (10000 credits)");
    console.log("   3. admin@example.com / admin123 (50000 credits)");
    console.log("   4. john@example.com / john123 (2500 credits)");

    console.log("\n✨ Database seed completed successfully!");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("🚨 Seed failed:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
