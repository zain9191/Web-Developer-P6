const app = require('./src/app'); // Import the app
const express = require('express');
const port = 3000;
const userCtrl = require("./src/controllers/user")
const helmet = require('helmet'); 


app.use(express.json());
app.use(helmet());


app.post("/api/auth/signup",userCtrl.signup)
app.post("/api/auth/login",userCtrl.login)



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
