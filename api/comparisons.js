const { connectToDatabase, client } = require('./db');  // Import the MongoDB client and connectToDatabase function

console.log("MongoDB URI loaded:", process.env.MONGODB_URI);  // Logs the URI for debugging (remove in production)

module.exports = async (req, res) => {
    // Connect to MongoDB only once before handling the request
    try {
        console.log('Attempting connection...');
        await connectToDatabase();  // Connect to the database (using the new async connectToDatabase function)
        console.log('Connected successfully');

        // Select the database
        const db = client.db("art-ranking");

        if (req.method === 'POST') {
            console.log('Received data:', req.body);

            // Insert the comparison data into the database
            await db.collection("comparisons").insertOne({
                winner: req.body.winner,
                loser: req.body.loser,
                timestamp: new Date(),
                type: req.body.type
            });
            console.log('Data saved successfully');
            res.json({ success: true });

        } else if (req.method === 'GET') {
            // Retrieve all comparisons from the database
            const comparisons = await db.collection("comparisons").find().toArray();
            res.json(comparisons);
        } else {
            // Handle unsupported HTTP methods
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    } catch (error) {
        // Log the error and send an appropriate response
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    } finally {
        // Optionally, close the database connection after the operation (only if you're opening a new connection each time)
        // In a serverless environment like Vercel, you may want to leave the connection open for the lifetime of the request.
        // await client.close(); // Uncomment this line if you want to close the connection after the request is finished
    }
};
