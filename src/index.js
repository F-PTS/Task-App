const express = require('express');
require('./db/mongoose');

const User = require('./db/models/user');
const Task = require('./db/models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/user', (req, res) => {
    const user = new User(req.body);

    user.save()
        .then(() => res.send(user))
        .catch(err => res.status(400).send(err));
});

app.post('/task', (req, res) => {
    const task = new Task(req.body);

    task.save()
        .then(() => res.send(task))
        .catch(err => res.status(400).send(err));
});

app.listen(port, () => {console.log('server is up on port' + port)});