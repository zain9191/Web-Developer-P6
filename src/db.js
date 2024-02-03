const mongoose = require('mongoose');
const uri = 'mongodb+srv://zain:zain@piquante.ukyhg6l.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;
