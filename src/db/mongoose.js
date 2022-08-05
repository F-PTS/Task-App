const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://localhost:27017/task-manager');

// Models

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

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}) 

const t = new User({
    name: 'Mike',
    email: 'mike@gmail.com',
    password: 'dawdawdasd',
    age: 20
})

t.save()
    .then( res => console.log(res))
    .catch(e => console.log(e));