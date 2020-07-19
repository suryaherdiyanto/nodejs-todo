require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');

const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@testing01.as5pr.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

const app = express();
const client = new mongodb.MongoClient(connectionString);

let db = undefined;

client.connect(function(error, client) {
    
    if (error !== null) {
        console.error(`Ooops connection failed: ${error}`);
    }
    console.log("connected!");
    
    db = client.db(process.env.MONGODB_DATABASE);    

    app.listen(3000);
});


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', function(req, res) {
    
    let tasks = [];

    db.collection('tasks').find().toArray(function(error, result) {

        if (error !== null) {
            console.error(`Mongodb error: ${error}`)
        }

        tasks.push(...result);

        res.render('home', { tasks: tasks });
    });

});

app.post('/save-item', function(req, res) {
    const item = req.body.item;

    db.collection('tasks').insertOne({ text: item }, function(error) {
        if (error !== null) {
            console.error(`Mongodb error: ${error}`)
        }

        res.redirect('/');
    });
});

app.post('/update-item/:id', function(req, res) {
    const { item } = req.body;
    const { id } = req.params;

    db.collection('tasks').findOneAndUpdate({ _id: new mongodb.ObjectID(id)}, { $set: { text: item } }, function(error) {
        if (error !== null) {
            console.error(`MongoDB error: ${error}`);
            res.status(500).json({ status: 'error', message: error.toString() });
        }

        res.status(200).json({ status: 'ok', message: 'success' });
    });
});

app.post('/delete-item/:id', function(req, res) {
    const { id } = req.params;

    db.collection('tasks').deleteOne({ _id: new mongodb.ObjectID(id) }, function(error) {
        if (error !== null) {
            console.error(`MongoDB error: ${error}`);
            res.status(500).json({ status: 'error', message: error.toString() });
        }
    });

    res.status(200).json({
        status: 'ok',
        message: 'Item has been deleted'
    });
})