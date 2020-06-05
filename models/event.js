const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
 
module.exports = Event;