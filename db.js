const mongoose = require('mongoose');

//  dotenv to load environment variables from a .env file
require('dotenv').config(); 

const uri = process.env.DB_URI; 

// Connecting to MongoDB 
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;
