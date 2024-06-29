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
const ServiceRequest = new require('./model/Services/ServiceRequest');
const Services = new require('./model/Services/Sevices');
const Notification = new require('./model/Notifications/Notifications');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Middleware for body-parser
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


function decodeToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}


// user login 
app.post('/login', async (req, res) => {

    try {

        // 2. Destructure username/email and password
        const { email, password } = req.body;

        // 3. Find user by email (using async/await for database operations)
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ status: "error", message: 'No user found with this email' });
            return;
        }

        // 4. Compare password hashes securely (using bcrypt)
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            res.status(401).json({ status: "error", message: 'wrong password' });
            return;
        }

        // 5. Generate JWT or other auth token (optional)
        // Implement JWT generation logic using a library like jsonwebtoken
        let token = jwt.sign({ id: user._id, email: email }, process.env.JWT_SECRET, {
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
            res.status(400).json({ status: "error", message: 'Email already in use' });1
            return;

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
        const email = decodeToken(req.headers['authorization']).email;
        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne({email: email });
        // console.log(JSON.stringify(user),req.headers['authorization']);
        
        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;
        }

        // 4. Send success response with user details
        res.status(200);
        res.json({ status: "success", data: user });
    } catch (error) {;
        res.status(500);
        res.json({ status: "error", message: 'Internal server error' });
    }

});

// request a service from service provider who is nearby to the service requester user
app.post('/requestservice', loginCheck, async (req, res) => {
    try {

        // 2. Get user ID from JWT
        const email = decodeToken(req.headers['authorization']).email;

        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne({email});
        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;
        }

        // 4. Create new service request (using async/await for database operations)
        let { location, date, serviceTaken } = req.body;
        location.type = 'Point';
        location.coordinates = [location.longitude, location.latitude];

        const serviceRequest = new ServiceRequest({ user: user._id, location, date, serviceTaken });
        await serviceRequest.save();

        let nearbyUsers = await findNearbyUsers(user.location.coordinates[0], user.location.coordinates[1], 20000);

        nearbyUsers.forEach(async (nearbyUser) => {
            const notification = new Notification({ user: user._id, serviceProvider: nearbyUser._id, message: `Service request from ${user.name}` });
            await notification.save();
        });


        // 4. Send success response with user details
        res.status(200).json({ status: "success", data: nearbyUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }

});

// get all service requests
app.post('/getallservicerequests', loginCheck, async (req, res) => {
    try {

        // 2. Get user ID from JWT
        const email = decodeToken(req.headers['authorization']).email;

        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne({email});
        console.log(user);
        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;

        }

        // 4. Find all service requests (using async/await for database operations)
        const serviceRequests = await ServiceRequest.find({ user: user._id });
        if (!serviceRequests) {
            res.status(404).json({ status: "error", message: 'No service requests found' });
            return;

        }

        // 5. Send success response with service requests
        res.status(200).json({ status: "success", data: serviceRequests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }

});

// get all services
app.post('/getallservices', loginCheck, async (req, res) => {
    try {

        // 2. Get user ID from JWT
        const email = req.user.email;

        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne({email});
        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;

        }

        // 4. Find all services (using async/await for database operations)
        const services = await Services.find();
        if (!services) {
            res.status(404).json({ status: "error", message: 'No services found' });
            return;

        }

        // 5. Send success response with services
        res.status(200).json({ status: "success", data: services });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }

});

app.post("/addservice", loginCheck, async (req, res) => {
    try {
        // 2. Get user ID from JWT
        const email = req.user.email;
        console.log(email);
        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne({email});

        console.log(user);

        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;

        }

        // 4. Create new service (using async/await for database operations)
        const { serviceName, description, price } = req.body;
        const service = new Services({ serviceName, description, price });

        await service.save();

        // 5. Send success response with service details
        res.status(200).json({ status: "success", message: "services added successfully", data: service });
    } catch (error) {
        res.status(500).json({ status: "error", message: 'Internal server error' });
        console.error(error);
    }
});

// Delete Service
app.post('/deleteservicerequest', loginCheck, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ status: "error", message: 'User not found or not authorized' });
            return;

        }

        const servicerequestId = req.body.servicerequestId;
        // Delete the service
        await ServiceRequest.findByIdAndDelete(servicerequestId);

        res.status(200).json({ status: "success", message: 'Service request deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }
});

// Edit Service Request
app.post('/editservicerequest', loginCheck, async (req, res) => {
    try {

        // 2. Get user ID from JWT
        const email = req.user.email;

        // 3. Find user by ID (using async/await for database operations)
        const user = await User.findOne({email});
        if (!user) {
            res.status(404).json({ status: "error", message: 'User not found' });
            return;

        }

        // 4. Create new service request (using async/await for database operations)
        const { location, date, serviceTaken } = req.body;
        location.type = 'Point';
        location.coordinates = [location.longitude, location.latitude];

        const serviceRequest = new ServiceRequest({ user: user._id, location, date, serviceTaken });
        await serviceRequest.save();

        let nearbyUsers = await findNearbyUsers(user.location.coordinates[0], user.location.coordinates[1], 20000);

        nearbyUsers.forEach(async (nearbyUser) => {
            const notification = new Notification({ user: user._id, serviceProvider: nearbyUser._id, message: `Service request from ${user.name}` });
            await notification.save();
        });


        // 4. Send success response with user details
        res.status(200).json({ status: "success", data: nearbyUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }

});

// Approve Service Request
app.post("/approveServiceRequest", loginCheck, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ status: "error", message: 'User not found or not authorized' });
            return;

        }

        const {servicerequestId, arrivaltime, endtime} = req.body;

        // update service status
        await ServiceRequest.findByIdAndUpdate(servicerequestId, { status: 'Accepted' , arrivalTime: arrivaltime, endTime: endtime});

        let OTPNotification = new Notification({ user: user._id, serviceProvider: servicerequestId, NotificationType: 'otp', message: `Service request from ${user.name} is accepted` });
        await OTPNotification.save();
        
        res.status(200).json({ status: "success", message: 'Service request approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }
});

// edit arrival time and end time of service request
app.post("/editarrivalendtime", loginCheck, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ status: "error", message: 'User not found or not authorized' });
            return;

        }

        const {servicerequestId, arrivaltime, endtime} = req.body;

        // update service status
        await ServiceRequest.findByIdAndUpdate(servicerequestId, { arrivalTime: arrivaltime, endTime: endtime });

        res.status(200).json({ status: "success", message: 'Service request updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }
});

// get user details of other user
app.post("/getspecificuserdetails", loginCheck, async (req, res) => {
    console.log("sdf");
    try {
        const email = req.user.email;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ status: "error", message: 'User not found or not authorized' });
            return;

        }

        const Email = req.body.email;
        console.log("asdsa");
        const otherUser = await User.findOne({Email});

        console.log(otherUser, "sdf");

        if (!otherUser) {
            return res.status(404).json({ status: "error", message: 'User not found' });
            return;
        }


        res.status(200).json({ status: "success", data: otherUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }
});

// add rate to service request
app.post("/addeditrating", loginCheck, async (req, res) => {
    try {
        const email = req.user.email;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({ status: "error", message: 'User not found or not authorized' });
        }

        const {servicerequestId, rating} = req.body;

        // update service status
        await ServiceRequest.findByIdAndUpdate(servicerequestId, { rating: rating });

        res.status(200).json({ status: "success", message: 'Rating added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: 'Internal server error' });
    }
});







app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
