const connectDB = require('../../model/dbconnecion');
const Notification = require('../../model/Notifications/Notifications');
const User = require('../../model/Users/User');
connectDB();
const fetchNotifications = async () => {
    try {
        const notifications = await Notification.find().populate('user serviceProvider'); // Adjust population as per your schema
        return notifications;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
};
fetchNotifications()
    .then(notifications => {
        console.log('Fetched notifications:', notifications);
        // Process notifications as needed
    })
    .catch(error => {
        console.error('Error fetching notifications:', error);
    });
module.exports = fetchNotifications;