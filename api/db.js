const { MongoClient } = require('mongodb');

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable in your .env.local file or Vercel project settings');
}

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

// Cache variables
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    // If we have a cached connection, return it
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    // If no cached connection, create a new one
    try {
        const client = new MongoClient(uri, options);
        await client.connect();
        const db = client.db('art-ranking'); // Your database name

        // Cache the connection
        cachedClient = client;
        cachedDb = db;

        return {
            client: cachedClient,
            db: cachedDb,
        };
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw new Error('Unable to connect to database');
    }
}

module.exports = { connectToDatabase };
