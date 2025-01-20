const { connectToDatabase, client } = require('./db');  // Import the MongoDB client and connectToDatabase function

console.log("MongoDB URI loaded:", process.env.MONGODB_URI);  // Logs the URI for debugging (remove in production)

module.exports = async (req, res) => {
    try {
        console.log('Attempting connection...');
        await connectToDatabase();  // Connect to the database
        console.log('Connected successfully');

        // Select the database
        const db = client.db("art-ranking");

        if (req.method === 'POST') {
            console.log('Received POST data:', req.body);

            // Check if the body has the expected fields
            if (!req.body.winner || !req.body.loser || !req.body.type) {
                console.log('Invalid data received:', req.body);
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Insert the comparison data into the database
            const result = await db.collection("comparisons").insertOne({
                winner: req.body.winner,
                loser: req.body.loser,
                timestamp: new Date(),
                type: req.body.type
            });

            console.log('Data saved successfully:', result);
            res.json({ success: true });

        } else if (req.method === 'GET') {
            console.log('GET request received');

            // Retrieve all comparisons from the database
            const comparisons = await db.collection("comparisons").find().toArray();
            console.log('Comparisons retrieved:', comparisons);
            res.json(comparisons);
        } else {
            // Handle unsupported HTTP methods
            res.status(405).json({ error: 'Method Not Allowed' });
        }

    } catch (error) {
        // Log any errors and send an appropriate response
        console.error('Error during database operation:', error);
        res.status(500).json({ error: error.message });
    } finally {
        // Optionally, close the connection after the operation (you can omit this if you're reusing the connection)
        // await client.close(); // Uncomment if you want to close the connection after the request is finished
    }
};
