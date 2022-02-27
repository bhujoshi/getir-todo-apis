const Express = require("express");
require('dotenv').config();
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require('cors');

const CONNECTION_URL = process.env.MONGODB_CONNECTION_URL; 
const DATABASE_NAME = "getir-task";
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

var database, collection;
console.log('Listening in port 5000');

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("todos");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});

app.post("/todos/item", (request, response) => {
    const {title, isComplete} = request.body;
    const creationTime = new Date();
    const data = {title, isComplete, creationTime}
    collection.insertOne(data, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.put("/todos/item/:id", (request, response) => {
    collection.updateOne({_id: new ObjectId(request.params.id)},{$set: {title: request.body.title, isComplete: request.body.isComplete}}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.delete("/todos/item/:id", (request, response) => {
    collection.deleteOne({_id: new ObjectId(request.params.id)}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    })
});

app.get("/todos", (request, response) => {
    collection.find({}).sort({"creationTime":-1}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});


