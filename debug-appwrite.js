// Debug script to check Appwrite database and collections
// Run this in your browser console to see what's available

import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://sfo.cloud.appwrite.io/v1')
    .setProject('68bd87cf003939f9cf46');

const databases = new Databases(client);

async function debugAppwrite() {
    try {
        console.log('=== Appwrite Debug ===');
        
        // List all databases
        console.log('1. Listing all databases...');
        const dbList = await databases.list();
        console.log('Available databases:', dbList);
        
        // Check if finboard-db exists
        const finboardDb = dbList.documents.find(db => db.$id === 'finboard-db');
        if (finboardDb) {
            console.log('✅ finboard-db found:', finboardDb);
            
            // List collections in finboard-db
            console.log('2. Listing collections in finboard-db...');
            const collections = await databases.listCollections('finboard-db');
            console.log('Available collections:', collections);
            
            // Check for users collection
            const usersCollection = collections.documents.find(col => col.$id === 'users');
            if (usersCollection) {
                console.log('✅ users collection found:', usersCollection);
            } else {
                console.log('❌ users collection not found');
            }
            
            // Check for transactions collection
            const transactionsCollection = collections.documents.find(col => col.$id === 'transactions');
            if (transactionsCollection) {
                console.log('✅ transactions collection found:', transactionsCollection);
            } else {
                console.log('❌ transactions collection not found');
            }
            
        } else {
            console.log('❌ finboard-db not found');
            console.log('Available database IDs:', dbList.documents.map(db => db.$id));
        }
        
    } catch (error) {
        console.error('Error debugging Appwrite:', error);
    }
}

// Run the debug function
debugAppwrite();
