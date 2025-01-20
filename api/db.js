import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
    throw new Error('Please define MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return {
            client: cachedClient,
            db: cachedDb,
        };
    }

    try {
        const client = new MongoClient(uri, options);
        await client.connect();
        const db = client.db('art-ranking');

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
