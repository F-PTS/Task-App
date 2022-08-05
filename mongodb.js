const { MongoClient, ObjectID } = require('mongodb');

// MongoDB database connection
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) return console.log('Unable to connect to database!')

    const db = client.db(databaseName);

    db.collection('users')
        .deleteMany({ name: 'Filip'})
        .then(res => console.log(res))
        .catch(err => console.log(err))
});
