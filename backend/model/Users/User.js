const mongoose = require('mongoose');
const services = require('../Services/Sevices');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
        type: String,
        enum: ['consumer', 'provider', 'admin'],
        default: 'consumer',
        required: true
    },
    location: {
        coordinates: { type: [Number], required: false } // [longitude, latitude]
    },
    services: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Services' }],
        default: []
    },
    createdAt: { type: Date, default: Date.now() }
});

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

module.exports = User;