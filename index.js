const express = require('express');
const app = express();
const mongoose = require("mongoose");
// const port = process.env.PORT || 5000;
const mongoURI = 'mongodb://localhost:27017/mernloginreg'

mongoose
    .connect(
        mongoURI, { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

app.get("/", (req, res) => {
    res.send('hello world')
});
app.listen(5000, () => `Server running on port 5000 🔥`);