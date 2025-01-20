// /pages/api/testConnection.js

import { MongoClient } from 'mongodb';

export default async (req, res) => {
    const uri = process.env.MONGODB_URI;  // MongoDB URI from environment variables

    if (!uri) {
        return res.status(500).json({ error: 'MongoDB URI is not set' });
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB successfully');

        const db = client.db('art-ranking');  // Choose your database name
        const collections = await db.collections();  // List collections
        console.log('Collections:', collections.map(col => col.collectionName));

        await client.close();  // Close the connection after testing
        return res.status(200).json({ success: true, collections: collections.map(col => col.collectionName) });
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        return res.status(500).json({ error: error.message });
    }
};
