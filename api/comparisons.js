const client = require('./db');

module.exports = async (req, res) => {
    try {
        await client.connect();
        const db = client.db("art-rankings");
        
        if (req.method === 'POST') {
            await db.collection("comparisons").insertOne({
                winner: req.body.winner,
                loser: req.body.loser,
                timestamp: new Date(),
                type: req.body.type
            });
            res.json({ success: true });
        }
        
        if (req.method === 'GET') {
            const comparisons = await db.collection("comparisons")
                .find()
                .toArray();
            res.json(comparisons);
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
