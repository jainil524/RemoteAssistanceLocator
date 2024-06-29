const connectDB = require('../../model/dbconnecion');
const Notification = require('../../model/Notifications/Notifications');
const User = require('../../model/Users/User');
const sendEmail = require('../Email/sendEmail'); // Import sendEmail function

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

    // Send emails to user and serviceProvider
    await sendEmail(NotificationType, message, userObj.email);
    await sendEmail(NotificationType, message, serviceProviderObj.email);

  } catch (error) {
    console.error('Error storing data:', error);
  }
};

// Example new data
const newData = {
  user: 'dhruv.raval.official@gmail.com',
  serviceProvider: 'kishanrathod967956@gmail.com',
  NotificationType: 'system',
  message: 'This is a test notification'
};

storeData(newData);

module.exports = storeData;
