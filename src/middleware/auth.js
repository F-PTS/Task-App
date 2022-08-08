const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'random');

        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        
        if(!user) throw new Error("no user found");

        req.token = token
        req.user = user
        next();
    } catch (err) {
        res.status(401).send({error: err})
        next();
    }
}

module.exports = auth