const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    dscription: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task;