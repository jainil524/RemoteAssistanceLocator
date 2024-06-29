const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    serviceRequest: { type: Schema.Types.ObjectId, ref: 'ServiceRequest', required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }, { type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [
        {
            sender: { type: Schema.Types.ObjectId, ref: 'User' },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;