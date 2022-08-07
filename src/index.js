const express = require('express');
require('./db/mongoose');

const User = require('./db/models/user');
const Task = require('./db/models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


// READ

app.get('/users', async (req, res) => {
    try {
        const users = User.find({});

        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = User.findById(req.params.id)

        if(!user) return res.status(404).send();

        res.send(user);
    } catch (error) {
        res.status(401).send(err);
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});

        res.send(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)

        if(!task) return res.status(404).send()

        res.send(task)
    } catch (err) {
        res.status(401).send(err)
    }
})

// CREATE

app.post('/users', async (req, res) => {
    
    const user = new User(req.body);
    
    try {
        await user.save();
        res.status(201).send(user)
    } catch (err) {
        res.status(400).send(err)
    }
});

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();

        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.listen(port, () => {console.log('server is up on port' + port)});