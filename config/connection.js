// IMPORT mongoose module
const mongoose = require('mongoose');

// SET connectionString to env variable (for productions), if not, then use local string for dev env
const connectionString =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialNetworkDB';

// METHOD to connect via connectionString
mongoose.connect(connectionString);

// EXPORT (imported by index.js as db)
module.exports = mongoose.connection;
