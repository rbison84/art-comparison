const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

console.log(process.env.MONGODB_URI); // Logs the URI to verify it's working

module.exports = client;
