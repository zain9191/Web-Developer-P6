const express = require('express'); 
const helmet = require('helmet'); 
const app = require('./app'); 

const port = 3000;

// Use Helmet middleware to enhance the security of the Express app
app.use(helmet());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
