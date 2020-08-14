const express = require('express');
const app = express();
const mongoose = require("mongoose");
// const port = process.env.PORT || 5000;

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { User } = require('./models/user');
const { auth } = require('./middleware/auth');
const config = require('./config/key');
const user = require('./models/user');
mongoose
    .connect(
        config.mongoURI, { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

app.get("/api/user/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role
    });
});

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
        // res.json(req.body)
    user.save((err, userData) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })

});
app.post('/api/user/login', (req, res) => {
    // find the email
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSucess: false,
                message: "Auth failed, email not found"
            });
        // comparing passwords
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({ loginSucess: false, message: "wrong password" })
            }
        })
        user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie("x_auth", user.token).status(200).json({
                loginSuccess: true
            })
        })
    })
})
app.get("/api/user/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).send({
            success: true
        })
    })
})

// app.get("/", (req, res) => {
//     res.send(req.body)
//         // res.send(req.params())
//         // res.json({ 'gi ya': 'thanku' })
// });
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port} `));