const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceRequestSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    serviceProvider: { type: Schema.Types.ObjectId, ref: 'User' },
    location: {
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    typeOfAssistance: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

serviceRequestSchema.index({ location: '2dsphere' });

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

module.exports = ServiceRequest;
