const mongoose = require('mongoose');
const User = require('../model/Users/User'); // Adjust the path as necessary


const findNearbyUsers = async (longitude, latitude, maxDistance=5000) => {
    try {
        const users = await User.find({
            $and: {
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        },
                        $maxDistance: maxDistance // Distance in meters
                    }
                },
                role: 'provider'
            }
        });
        return users;
    } catch (error) {
        console.error(`Error finding nearby users: ${error.message}`);
        throw error;
    }
};

module.exports = findNearbyUsers;