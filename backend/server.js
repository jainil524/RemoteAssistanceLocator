const express = require('express');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./model/dbconnecion');

const User = require('./model/Users/User');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware for body-parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); 

// Middleware for JWT
app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401);
        res.json({ status: 'error', error: 'login required! Please login' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400);
        if( error.name === 'TokenExpiredError' ){
            res.json({ status: 'error', error: 'Invalid Token or expired' });
        }
        else{
            res.json({ status: 'error', error: 'Invalid Token' });
        }
    }
});


// Routes

// user login 
app.post('/login', (req, res) => {

    let { email, password } = req.body;

    // check if user exists
    const user = User;
    user.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500);
            res.json({ status: 'error', error: 'Internal error please try again' });
        } else if (!user) {
            res.status(401);
            res.json({ status: 'error', error: 'User does not exist' });
        } else {
            user.isPasswordMatch(password, user.password, (err, matched) => {
                if (matched) {
                    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    });

                    res.status(200);
                    res.json({ status: 'success', token: token });
                } else {
                    res.status(401);
                    res.json({ status: 'error', error: 'Invalid credentials' });
                }
            });
        }
    });

});

// user registration
app.post('/register', (req, res) => {
    let {
        name,
        email,
        mobile_no,
        password,
        role,
        loc = null
    } = req.body;
    
    // check if user already exists
    const user = User;
    user.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500);
            res.json({ status: 'error', error: 'Internal error please try again' });
        } else if (user) {
            res.status(400);
            res.json({ status: 'error', error: 'User already exists' });
        } else {
            const newUser = new User({
                name,
                email,
                mobile_no,
                password,
                role,
                loc
            });

            let token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: 86400 // expires in 24 hours
            });

            newUser.save((err, user) => {
                if (err) {
                    res.status(500);
                    res.json({ status: 'error', error: 'Internal error please try again' });
                } else {
                    res.status(200);
                    res.json({ status:'success', token: token, message: 'User created successfully' });
                }
            });
        }
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
