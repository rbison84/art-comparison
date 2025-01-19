const client = require('./db');

module.exports = async (req, res) => {
    try {
        console.log('Attempting connection...');
        await client.connect();
        console.log('Connected successfully');
        const db = client.db("art-rankings");
        
        if (req.method === 'POST') {
            console.log('Received data:', req.body);
            await db.collection("comparisons").insertOne({
                winner: req.body.winner,
                loser: req.body.loser,
                timestamp: new Date(),
                type: req.body.type
            });
            console.log('Data saved successfully');
            res.json({ success: true });
        }
        
        if (req.method === 'GET') {
            const comparisons = await db.collection("comparisons")
                .find()
                .toArray();
            res.json(comparisons);
        }
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
};
