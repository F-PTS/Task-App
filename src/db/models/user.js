const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v)) throw new Error('Email invalid');
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(v) {
            if(v.length <= 6 && v.toLowerCase().includes(password)) throw new Error("Your password doesn't meet the requirements. It has to be at least 6 characters long.");
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(v) {
            if (v < 0) throw new Error('Age must be a positive number');
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'random');

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch || !user) throw new Error('Unable to log in');

    return user;
}

userSchema.pre('save', async function (next) {
    const user = this;

    if(user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;