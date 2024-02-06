const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');  
const mongoose = require('./db');
const path = require('path');


// Import MongoDB model and routes
// const userRoutes = require("./routes/user");


app.use(cors());
app.use(express.json());


const sauceRoutes = require("./routes/sauce")
const userRoutes = require("./routes/user");


app.use((req, res, next) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  
  app.use("/api/sauces", sauceRoutes);
 
  app.use("/api/signup", userRoutes);

  app.use("/images", express.static(path.join(__dirname, "assets", "images")));


module.exports = app;