const connectDB = require('../../model/dbconnecion');
const Notification = require('../../model/Notifications/Notifications');
const User = require('../../model/Users/User');

const storeData = async (data) => {
  await connectDB();

  try {
    const { user, serviceProvider, NotificationType, message } = data;

    // Find user by email
    const userObj = await User.findOne({ email: user });
    if (!userObj) {
      throw new Error('User not found');
    }

    // Find service provider by email (assuming serviceProvider is also identified by email)
    const serviceProviderObj = await User.findOne({ email: serviceProvider });
    if (!serviceProviderObj) {
      throw new Error('Service provider not found');
    }

    // Create a new notification
    const notification = new Notification({
      user: userObj._id,
      serviceProvider: serviceProviderObj._id,
      NotificationType,
      message
    });

    const result = await notification.save();
    console.log(`New document inserted with _id: ${result._id}`);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Example new data
const newData = {
  user: 'user@example.com',
  serviceProvider: 'serviceProvider@example.com',
  NotificationType: 'system',
  message: 'This is a test notification'
};

storeData(newData);

module.exports = storeData;
