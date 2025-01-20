// api/mongodb-diagnostic.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const diagnosticResults = {
        timestamp: new Date().toISOString(),
        environment: {
            hasMongoURI: !!process.env.MONGODB_URI
        },
        connection: null,
        database: null,
        collections: null,
        error: null
    };

    try {
        // Test connection
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        diagnosticResults.connection = "successful";

        // Test database access
        const db = client.db('art-ranking');
        const collections = await db.listCollections().toArray();
        diagnosticResults.database = "accessible";
        diagnosticResults.collections = collections.map(c => c.name);

        await client.close();
    } catch (error) {
        diagnosticResults.error = {
            message: error.message,
            type: error.name
        };
    }

    res.json(diagnosticResults);
}
