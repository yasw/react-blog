const express = require('express');
const app = express();
const mongoose = require("mongoose");
// const port = process.env.PORT || 5000;

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const { User } = require('./models/user');
const config = require('./config/key')
mongoose
    .connect(
        config.mongoURI, { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
        // res.json(req.body)
    user.save((err, userData) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })

})

app.get("/", (req, res) => {
    res.send(req.body)
        // res.send(req.params())
        // res.json({ 'gi ya': 'thanku' })
});
app.listen(5000, () => `Server running on port 5000 🔥`);