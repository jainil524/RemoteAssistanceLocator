const mongoose = require('mongoose');

const connectDB = require("../model/dbconnecion");
const User = require('../model/Users/User'); // Adjust the path as necessary

connectDB();


const findNearbyUsers = async (longitude, latitude, maxDistance) => {
  try {
    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance // Distance in meters
        }
      }
    });
    return users;
  } catch (error) {
    console.error(`Error finding nearby users: ${error.message}`);
    throw error;
  }
};

// Example usage
(async () => {
  try {
    const longitude = -73.935242;
    const latitude = 40.730610;
    const maxDistance = 5000; // 5 kilometers

    const nearbyUsers = await findNearbyUsers(longitude, latitude, maxDistance);
    console.log('Nearby Users:', nearbyUsers);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
})();