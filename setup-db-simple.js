#!/usr/bin/env node

import { Client, Databases, ID, Permission, Role } from 'appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68bd87cf003939f9cf46');

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'finboard-db';

console.log('🚀 Setting up FinBoard Appwrite Database...');
console.log(`📊 Database ID: ${DATABASE_ID}`);
console.log(`🔗 Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'}`);
console.log(`🆔 Project ID: ${process.env.VITE_APPWRITE_PROJECT_ID || '68bd87cf003939f9cf46'}`);

async function setupDatabase() {
    try {
        // Check if database exists
        try {
            await databases.get(DATABASE_ID);
            console.log('✅ Database already exists');
        } catch (error) {
            if (error.code === 404) {
                console.log('📦 Creating database...');
                await databases.create(DATABASE_ID, 'FinBoard Database');
                console.log('✅ Database created successfully');
            } else {
                throw error;
            }
        }

        // Setup collections
        await setupCollections();

        console.log('🎉 Database setup completed successfully!');
        console.log('📋 Collections created:');
        console.log('   - users (user profiles and preferences)');
        console.log('   - transactions (financial transactions)');
        console.log('   - goals (financial goals)');
        console.log('   - categories (transaction categories)');

    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        if (error.code === 401) {
            console.error('🔑 Authentication failed. Please check your Appwrite credentials.');
        } else if (error.code === 404) {
            console.error('🏗️ Project not found. Please check your Project ID.');
        }
        process.exit(1);
    }
}

async function setupCollections() {
    const collections = [
        {
            id: 'users',
            name: 'Users',
            attributes: [
                { key: 'name', type: 'string', size: 255, required: true },
                { key: 'email', type: 'string', size: 255, required: true },
                { key: 'preferences', type: 'string', size: 2000, required: false },
                { key: 'createdAt', type: 'datetime', required: true }
            ]
        },
        {
            id: 'transactions',
            name: 'Transactions',
            attributes: [
                { key: 'userId', type: 'string', size: 255, required: true },
                { key: 'title', type: 'string', size: 255, required: true },
                { key: 'description', type: 'string', size: 1000, required: false },
                { key: 'amount', type: 'double', required: true },
                { key: 'currency', type: 'string', size: 10, required: true },
                { key: 'category', type: 'string', size: 100, required: true },
                { key: 'date', type: 'datetime', required: true },
                { key: 'createdAt', type: 'datetime', required: true }
            ]
        },
        {
            id: 'goals',
            name: 'Goals',
            attributes: [
                { key: 'userId', type: 'string', size: 255, required: true },
                { key: 'title', type: 'string', size: 255, required: true },
                { key: 'targetAmount', type: 'double', required: true },
                { key: 'currentAmount', type: 'double', required: true },
                { key: 'currency', type: 'string', size: 10, required: true },
                { key: 'targetDate', type: 'datetime', required: true },
                { key: 'status', type: 'string', size: 50, required: true },
                { key: 'createdAt', type: 'datetime', required: true }
            ]
        },
        {
            id: 'categories',
            name: 'Categories',
            attributes: [
                { key: 'name', type: 'string', size: 100, required: true },
                { key: 'type', type: 'string', size: 50, required: true },
                { key: 'color', type: 'string', size: 20, required: false },
                { key: 'isDefault', type: 'boolean', required: true },
                { key: 'createdAt', type: 'datetime', required: true }
            ]
        }
    ];

    for (const collection of collections) {
        await setupCollection(collection);
    }
}

async function setupCollection(collectionConfig) {
    try {
        // Check if collection exists
        try {
            await databases.getCollection(DATABASE_ID, collectionConfig.id);
            console.log(`✅ Collection '${collectionConfig.id}' already exists`);
            return;
        } catch (error) {
            if (error.code !== 404) {
                throw error;
            }
        }

        console.log(`📦 Creating collection '${collectionConfig.id}'...`);

        // Create collection
        await databases.createCollection(
            DATABASE_ID,
            collectionConfig.id,
            collectionConfig.name
        );

        // Add attributes
        for (const attr of collectionConfig.attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        collectionConfig.id,
                        attr.key,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'double') {
                    await databases.createFloatAttribute(
                        DATABASE_ID,
                        collectionConfig.id,
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        DATABASE_ID,
                        collectionConfig.id,
                        attr.key,
                        attr.required
                    );
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(
                        DATABASE_ID,
                        collectionConfig.id,
                        attr.key,
                        attr.required
                    );
                }
            } catch (error) {
                if (error.code !== 409) { // Attribute already exists
                    console.warn(`⚠️ Failed to create attribute '${attr.key}':`, error.message);
                }
            }
        }

        // Set permissions
        await databases.updateCollection(
            DATABASE_ID,
            collectionConfig.id,
            collectionConfig.name,
            collectionConfig.id === 'categories' ? [] : [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );

        console.log(`✅ Collection '${collectionConfig.id}' created successfully`);

    } catch (error) {
        console.error(`❌ Failed to create collection '${collectionConfig.id}':`, error.message);
        throw error;
    }
}

// Run the setup
setupDatabase()
    .then(() => {
        console.log('\n🎉 FinBoard database setup completed!');
        console.log('\n📋 Next steps:');
        console.log('1. Update your .env file with the correct database ID');
        console.log('2. Set up authentication in Appwrite Console');
        console.log('3. Configure CORS settings for your domain');
        console.log('4. Start your application!');
    })
    .catch((error) => {
        console.error('\n❌ Setup failed:', error.message);
        process.exit(1);
    });

