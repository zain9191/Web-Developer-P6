const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse the request body as JSON
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: "Eall is good" });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
