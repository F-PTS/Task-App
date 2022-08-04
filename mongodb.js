const Mongo = require('mongodb').MongoClient

// MongoDB database connection
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

Mongo.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }
    const db = client.db(databaseName);

    db.collection('users')
        .insertOne({ name: 'Andrew', age: 27 })
        .then(res => { console.log(res) }, err => { console.log(err) });

    db.collection('users')
        .insertMany([
            { name: 'Filip', age: 17 },
            { name: 'Mateusz', age: 26 },
            { name: 'Aleksander', age: 25 }
        ]).then(
            res => {console.log(res)},
            err => {console.log(err)}
        );
});
