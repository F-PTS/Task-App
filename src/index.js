const express = require('express');
const jwt = require('jsonwebtoken');

require('./db/mongoose');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const userRouter = require('./routers/user'); 
const taskRouter = require('./routers/task');

app.use(userRouter, taskRouter);

app.listen(port, () => console.log('server is up on port' + port));