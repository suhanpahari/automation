const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

conversationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;