const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v)) throw new Error('Email invalid')
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(v) {
            if(v.length <= 6 && v.toLowerCase().includes(password)) throw new Error('Wrong password!') 
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(v) {
            if (v < 0) throw new Error('Age must be a positive number');
        }
    }
})

module.exports = User;