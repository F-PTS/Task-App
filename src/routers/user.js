const express = require('express');
const User = require('../db/models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

// read
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

// create
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();

        await user.save();
        res.status(201).send({user, token});
    } catch (err) {
        res.status(400).send(err)
    }
});

// login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(202).send({user, token});
    } catch (err) {
        res.status(401).send();
    }
});

// logout All
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500).send({error});
    }
})

// logout one
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        });

        await req.user.save();
        res.send({ message: "Sucessfuly logged out"});
    } catch (err) {
        res.status(500).send();
    }
})

// update
router.patch('/users/me', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];

        const isValidOperation = updates.every(update => {
            allowedUpdates.includes(update);
        })

        if(isValidOperation) return res.status(400).send({ error: "Invalid update: You're trying to update not allowed fields" });

        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save();

        res.send(user);
    } catch(err) {
        res.status(400).send(err);
    }
})

// delete
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user);
    } catch (err) {
        res.send(err);
    }
})

module.exports = router