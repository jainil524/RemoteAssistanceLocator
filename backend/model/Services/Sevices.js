const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true }
});

serviceSchema.index({ location: '2dsphere' });

const Services = mongoose.model('Services', serviceSchema);

module.exports = Services;