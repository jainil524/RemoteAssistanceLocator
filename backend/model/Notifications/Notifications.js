const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceProvider: { type: Schema.Types.ObjectId, ref: 'User' },
    NotificationType: { type: String, enum: ["otp", "system", "service"], require: true},
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;