const express = require('express');
const app = express();
const PORT = 3000;

const connectDB = require('./model/dbconnecion');

const cors = require("cors");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('./utils/hashPassword');
const findNearbyUsers = require('./utils/findDistanceFromUser');
const loginCheck = require('./MiddleWare/loginCheck');

const User = new require('./model/Users/User');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware for body-parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes

// user login 
app.post('/login', async (req, res) => {

    try {

        // 2. Destructure username/email and password
        const { email, password } = req.body;

        // 3. Find user by email (using async/await for database operations)
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(401).json({ status: "error", message: 'No user found with this email' });
        }

        // 4. Compare password hashes securely (using bcrypt)
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.status(401).json({ status: "error", message: 'wrong password' });
        }

        // 5. Generate JWT or other auth token (optional)
        // Implement JWT generation logic using a library like jsonwebtoken
        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });

        // 6. Send success response with JWT or other token (if applicable)
        res.status(200).json({ status: "success", message: 'Login successful', role: user.role, token: token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }

});

// user registration
app.post('/register', async (req, res) => {
    try {

        // 2. Destructure sanitized data
        const { name, email, phone, password, role, location } = req.body;

        // 3. Check for existing user (using async/await for cleaner handling)
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.status(400).json({ status: "error", message: 'Email already in use' });
        }

        let hashedPassword = await hashPassword(password);

        // 5. Create new user (using async/await for database operations)
        const newUser = new User({ name, email, phone, password: hashedPassword, role, location });
        await newUser.save();

        // 6. Send success response (optionally with a JWT or other auth token)
        res.status(201).send({ status: "success", message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }

});

// get user details
app.post('/getuserdetails', loginCheck, async (req, res) => {
    try {

        // 2. Get user ID from JWT
        const email = req.user.email;

        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne(email);
        if (!user) {
            res.status(404);
            res.json({ status: "error", message: 'User not found' });
        }

        // 4. Send success response with user details
        res.status(200);
        res.json({ status: "success", data: user });
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ status: "error", message: 'Internal server error' });
    }

});

// request a service from service provider who is nearby to the service requester user
app.post('/requestservice', loginCheck, async (req, res) => {
    try {

        // 2. Get user ID from JWT
        const email = req.user.email;

        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne(email);
        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
        }

        let nearbyUsers = await findNearbyUsers(user.location.coordinates[0], user.location.coordinates[1]);

        // 4. Send success response with user details
        res.status(200).json({ status: "success", data: nearbyUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }

});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
