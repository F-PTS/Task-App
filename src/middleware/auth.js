const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'random');

        const user = await User.findOne({ _id: decoded._id, 'token.token': token });
        
        if(!user) throw new Error();

        req.user = user
        next();
    } catch (err) {
        res.status(401).send({error: "Please authenticate"})
        next();
    }
}

module.exports = auth