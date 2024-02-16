const express = require('express');
const app = express();
// const port = process.env.PORT || 3000;
const cors = require('cors');  
const mongoose = require('./db');
const path = require('path');

app.use(cors());
app.use(express.json());

const sauceRoutes = require("./routes/sauce")
const userRoutes = require("./routes/user");

app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

app.use("/images", express.static(path.join(__dirname, "assets", "images")));

module.exports = app;
