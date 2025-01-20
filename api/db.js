const { MongoClient } = require('mongodb');

// MongoDB URI (loaded from environment variable)
const uri = process.env.MONGODB_URI;
console.log("MongoDB URI Loaded:", uri); // Only for debugging locally

// MongoDB client instance
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to connect to MongoDB (with async/await)
async function connectToDatabase() {
    try {
        // Connect to the database
        await client.connect();
        console.log("Successfully connected to MongoDB!");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Rethrow error to handle it in the calling function
    }
}

// Export the connect function and client
module.exports = { client, connectToDatabase };
