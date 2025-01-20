import { connectToDatabase } from './db.js';

export default async function handler(req, res) {
    console.log('API route started');
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        console.log('About to connect to database');
        const { db } = await connectToDatabase();
        console.log('Connected to database');

        if (req.method === 'POST') {
            console.log('POST method detected');
            console.log('Request body:', req.body);
            
            // Validate request body
            const { winner, loser, type } = req.body;
            
            if (!winner || !loser || !type) {
                console.log('Invalid request data:', req.body);
                return res.status(400).json({
                    error: 'Missing required fields',
                    required: ['winner', 'loser', 'type'],
                    received: req.body
                });
            }

            try {
                // Insert comparison into database
                const comparison = {
                    winner,
                    loser,
                    type,
                    timestamp: new Date(),
                    metadata: {
                        createdAt: new Date(),
                        userAgent: req.headers['user-agent'],
                        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                    }
                };

                const result = await db.collection('comparisons').insertOne(comparison);

                console.log('Successfully saved comparison:', result.insertedId);
                return res.status(200).json({
                    success: true,
                    insertedId: result.insertedId,
                    comparison
                });

            } catch (dbError) {
                console.error('Database insertion error:', dbError);
                return res.status(500).json({
                    error: 'Failed to save comparison',
                    message: process.env.NODE_ENV === 'development' ? dbError.message : 'Internal server error'
                });
            }
        }

        else if (req.method === 'GET') {
            console.log('GET request detected');
            
            try {
                // Get query parameters
                const limit = parseInt(req.query.limit) || 100;
                const skip = parseInt(req.query.skip) || 0;

                // Fetch comparisons with pagination
                const comparisons = await db.collection('comparisons')
                    .find({})
                    .sort({ timestamp: -1 })
                    .skip(skip)
                    .limit(limit)
                    .toArray();

                // Get total count
                const total = await db.collection('comparisons').countDocuments();

                console.log(`Retrieved ${comparisons.length} comparisons`);
                return res.status(200).json({
                    success: true,
                    data: comparisons,
                    pagination: {
                        total,
                        limit,
                        skip,
                        hasMore: skip + comparisons.length < total
                    }
                });

            } catch (dbError) {
                console.error('Database query error:', dbError);
                return res.status(500).json({
                    error: 'Failed to retrieve comparisons',
                    message: process.env.NODE_ENV === 'development' ? dbError.message : 'Internal server error'
                });
            }
        }

        else {
            return res.status(405).json({
                error: 'Method not allowed',
                allowedMethods: ['GET', 'POST']
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Server error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}
