const express = require('express');
const bcrypt = require('bcrypt');

const Task = require('../db/models/task');
const router = new express.Router();

// READ

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});

        res.send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if(!task) return res.status(404).send()

        res.send(task)
    } catch (err) {
        res.status(401).send(err)
    }
})

// CREATE

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// UPDATE

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidOperation = updates.every(update => {
        allowedUpdates.includes(update);
    })

    if(isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' });

    try {
        const task = await Task.findById(req.params.id);
        updates.forEach(update => task[update] = req.body[update]);
    
        await task.save();

        if(!task) res.status(404).send();

        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
})

// DELETE

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if(!task) return res.status(404).send();

        res.send(task);
    } catch (err) {
        res.send(err);
    }
})

module.exports = router;