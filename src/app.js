const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse the request body as JSON
app.use(express.json());

// Import  MongoDB model
const userModel = require('./model');

// Example route using MongoDB
app.get('/users', async (req, res) => {
    try {
        // 'users' collection in MongoDB
        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
