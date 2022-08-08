const express = require('express');
const User = require('../db/models/user');
const auth = require('../middleware/auth');

const router = new express.Router();

// read

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user) return res.status(404).send();

        res.send(user);
    } catch (err) {
        res.status(401).send(err);
    }
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

// logout

router.post('/users/logout', auth, async (req, res) => {
    try {

        console.log(req.user.tokens);

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

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);

    const allowedUpdates = ['name', 'email', 'password', 'age'];

    const isValidOperation = updates.every(update => {
        allowedUpdates.includes(update);
    })

    if(isValidOperation) return res.status(400).send({ error: "Invalid update: You're trying to update not allowed fields" });

    try {

        const user = await User.findById(req.params.id);
        updates.forEach(update => user[update] = req.body[update])

        await user.save();

        if(!user) res.status(404).send();

        res.send(user);
    } catch(err) {
        res.status(400).send(err);
    }
})

// delete

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) return res.status(404).send();

        res.send(user);
    } catch (err) {
        res.send(err);
    }
})

module.exports = router