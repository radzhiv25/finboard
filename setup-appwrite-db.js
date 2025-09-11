#!/usr/bin/env node

import { Client, Databases, ID, Permission, Role } from 'appwrite';
import fs from 'fs';
import path from 'path';
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
        console.log('   - reports (cached report data)');
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
                { key: 'avatar', type: 'string', size: 500, required: false },
                { key: 'preferences', type: 'string', size: 2000, required: false },
                { key: 'createdAt', type: 'datetime', required: true },
                { key: 'updatedAt', type: 'datetime', required: true }
            ],
            indexes: [
                { key: 'email', type: 'key', attributes: ['email'], orders: ['ASC'] },
                { key: 'createdAt', type: 'key', attributes: ['createdAt'], orders: ['DESC'] }
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
                { key: 'subcategory', type: 'string', size: 100, required: false },
                { key: 'tags', type: 'string', size: 500, required: false },
                { key: 'date', type: 'datetime', required: true },
                { key: 'isRecurring', type: 'boolean', required: false, default: false },
                { key: 'recurringFrequency', type: 'string', size: 50, required: false },
                { key: 'createdAt', type: 'datetime', required: true },
                { key: 'updatedAt', type: 'datetime', required: true }
            ],
            indexes: [
                { key: 'userId', type: 'key', attributes: ['userId'], orders: ['ASC'] },
                { key: 'date', type: 'key', attributes: ['date'], orders: ['DESC'] },
                { key: 'category', type: 'key', attributes: ['category'], orders: ['ASC'] },
                { key: 'amount', type: 'key', attributes: ['amount'], orders: ['DESC'] },
                { key: 'userId_date', type: 'key', attributes: ['userId', 'date'], orders: ['ASC', 'DESC'] }
            ]
        },
        {
            id: 'reports',
            name: 'Reports',
            attributes: [
                { key: 'userId', type: 'string', size: 255, required: true },
                { key: 'reportType', type: 'string', size: 100, required: true },
                { key: 'timeRange', type: 'string', size: 50, required: true },
                { key: 'data', type: 'string', size: 10000, required: true },
                { key: 'generatedAt', type: 'datetime', required: true },
                { key: 'expiresAt', type: 'datetime', required: true }
            ],
            indexes: [
                { key: 'userId', type: 'key', attributes: ['userId'], orders: ['ASC'] },
                { key: 'reportType', type: 'key', attributes: ['reportType'], orders: ['ASC'] },
                { key: 'generatedAt', type: 'key', attributes: ['generatedAt'], orders: ['DESC'] },
                { key: 'userId_type', type: 'key', attributes: ['userId', 'reportType'], orders: ['ASC', 'ASC'] }
            ]
        },
        {
            id: 'goals',
            name: 'Goals',
            attributes: [
                { key: 'userId', type: 'string', size: 255, required: true },
                { key: 'title', type: 'string', size: 255, required: true },
                { key: 'description', type: 'string', size: 1000, required: false },
                { key: 'targetAmount', type: 'double', required: true },
                { key: 'currentAmount', type: 'double', required: true },
                { key: 'currency', type: 'string', size: 10, required: true },
                { key: 'targetDate', type: 'datetime', required: true },
                { key: 'category', type: 'string', size: 100, required: true },
                { key: 'status', type: 'string', size: 50, required: true, default: 'active' },
                { key: 'createdAt', type: 'datetime', required: true },
                { key: 'updatedAt', type: 'datetime', required: true }
            ],
            indexes: [
                { key: 'userId', type: 'key', attributes: ['userId'], orders: ['ASC'] },
                { key: 'status', type: 'key', attributes: ['status'], orders: ['ASC'] },
                { key: 'targetDate', type: 'key', attributes: ['targetDate'], orders: ['ASC'] },
                { key: 'userId_status', type: 'key', attributes: ['userId', 'status'], orders: ['ASC', 'ASC'] }
            ]
        },
        {
            id: 'categories',
            name: 'Categories',
            attributes: [
                { key: 'name', type: 'string', size: 100, required: true },
                { key: 'type', type: 'string', size: 50, required: true },
                { key: 'color', type: 'string', size: 20, required: false },
                { key: 'icon', type: 'string', size: 50, required: false },
                { key: 'isDefault', type: 'boolean', required: true, default: false },
                { key: 'isActive', type: 'boolean', required: true, default: true },
                { key: 'createdAt', type: 'datetime', required: true }
            ],
            indexes: [
                { key: 'name', type: 'unique', attributes: ['name'], orders: ['ASC'] },
                { key: 'type', type: 'key', attributes: ['type'], orders: ['ASC'] },
                { key: 'isActive', type: 'key', attributes: ['isActive'], orders: ['ASC'] }
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
                        attr.required,
                        attr.default
                    );
                } else if (attr.type === 'double') {
                    await databases.createFloatAttribute(
                        DATABASE_ID,
                        collectionConfig.id,
                        attr.key,
                        attr.required,
                        attr.default
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        DATABASE_ID,
                        collectionConfig.id,
                        attr.key,
                        attr.required,
                        attr.default
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

        // Add indexes
        for (const index of collectionConfig.indexes) {
            try {
                if (index.type === 'key') {
                    await databases.createIndex(
                        DATABASE_ID,
                        collectionConfig.id,
                        index.key,
                        index.type,
                        index.attributes,
                        index.orders
                    );
                } else if (index.type === 'unique') {
                    await databases.createIndex(
                        DATABASE_ID,
                        collectionConfig.id,
                        index.key,
                        index.type,
                        index.attributes,
                        index.orders
                    );
                }
            } catch (error) {
                if (error.code !== 409) { // Index already exists
                    console.warn(`⚠️ Failed to create index '${index.key}':`, error.message);
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

async function seedDefaultCategories() {
    console.log('🌱 Seeding default categories...');

    const defaultCategories = [
        // Income categories
        { name: 'Income', type: 'income', color: '#10b981', icon: 'trending-up', isDefault: true },
        { name: 'Investment', type: 'income', color: '#3b82f6', icon: 'trending-up', isDefault: true },
        { name: 'Salary', type: 'income', color: '#10b981', icon: 'dollar-sign', isDefault: true },
        { name: 'Freelance', type: 'income', color: '#8b5cf6', icon: 'briefcase', isDefault: true },
        { name: 'Bonus', type: 'income', color: '#f59e0b', icon: 'gift', isDefault: true },

        // Expense categories
        { name: 'Food & Dining', type: 'expense', color: '#ef4444', icon: 'utensils', isDefault: true },
        { name: 'Transportation', type: 'expense', color: '#f97316', icon: 'car', isDefault: true },
        { name: 'Shopping', type: 'expense', color: '#ec4899', icon: 'shopping-bag', isDefault: true },
        { name: 'Entertainment', type: 'expense', color: '#8b5cf6', icon: 'film', isDefault: true },
        { name: 'Bills & Utilities', type: 'expense', color: '#06b6d4', icon: 'receipt', isDefault: true },
        { name: 'Healthcare', type: 'expense', color: '#84cc16', icon: 'heart', isDefault: true },
        { name: 'Education', type: 'expense', color: '#6366f1', icon: 'book', isDefault: true },
        { name: 'Travel', type: 'expense', color: '#14b8a6', icon: 'plane', isDefault: true },
        { name: 'Groceries', type: 'expense', color: '#f59e0b', icon: 'shopping-cart', isDefault: true },
        { name: 'Other', type: 'expense', color: '#6b7280', icon: 'more-horizontal', isDefault: true }
    ];

    for (const category of defaultCategories) {
        try {
            await databases.createDocument(
                DATABASE_ID,
                'categories',
                ID.unique(),
                {
                    ...category,
                    createdAt: new Date().toISOString()
                }
            );
        } catch (error) {
            if (error.code !== 409) { // Document already exists
                console.warn(`⚠️ Failed to seed category '${category.name}':`, error.message);
            }
        }
    }

    console.log('✅ Default categories seeded successfully');
}

// Run the setup
setupDatabase()
    .then(() => seedDefaultCategories())
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
