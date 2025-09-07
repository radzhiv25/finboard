// Check current Appwrite configuration
console.log('=== Appwrite Configuration Check ===');
console.log('Endpoint:', import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1');
console.log('Project ID:', import.meta.env.VITE_APPWRITE_PROJECT_ID || 'your-project-id');
console.log('Database ID:', import.meta.env.VITE_APPWRITE_DATABASE_ID || 'finboard-db');
console.log('Current Origin:', window.location.origin);
console.log('Current Hostname:', window.location.hostname);
console.log('=====================================');
