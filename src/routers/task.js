const express = require('express');
const auth = require('../middleware/auth');

const Task = require('../db/models/task');
const router = new express.Router();

// READ
router.get('/tasks', auth, async (req, res) => {
    try {
        if(req.query.completed) {
            completed = req.query.completed === "true";
            const tasks = await Task.find({ owner: req.user._id, completed });
        }

        const tasks = await Task.find({ owner: req.user._id});

        res.send(tasks);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if(!task) return res.status(404).send()

        res.send(task)
    } catch (err) {
        res.status(401).send(err)
    }
})

// CREATE

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

// UPDATE

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];

    const isValidOperation = updates.every(update => {
        allowedUpdates.includes(update);
    })

    if(isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' });

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        updates.forEach(update => task[update] = req.body[update]);
    
        await task.save();

        if(!task) res.status(404).send();

        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
})

// DELETE

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete({_id: req.params.id, owner: req.user._id});

        if(!task) return res.status(404).send();

        res.send(task);
    } catch (err) {
        res.send(err);
    }
})

module.exports = router;