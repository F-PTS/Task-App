const express = require('express');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.post('/users', (req, res) => {
    res.send('testing');
    console.log(req.body);
})

app.listen(port, () => {console.log('server is up on port' + port)});