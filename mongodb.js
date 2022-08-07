//CRUD

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectId = mongodb.ObjectId

const { MongoClient, ObjectId } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databasenName = 'task-manager'

MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Unable connect to database!")
    }
    const db = client.db(databasenName)

    //CREATE
    /* db.collection('tasks').insertMany([
        {
            description: 'desc1',
            completed: true
        },
        {
            description: 'desc2',
            completed: false
        },
        {
            description: 'desc3',
            completed: true
        }
    ], (error, result) => {
        if (error) {
            return console.log("Unable to write tasks")
        }
        console.log(result)
    }) */

    //READ
    /* db.collection('tasks').findOne({ _id: new ObjectId("62ebf9ad33154fbeff57b457") }, (error, result) => {
        if (error) {
            return console.log("Unable to find task!")
        }
        console.log(result)
    })

    db.collection('tasks').find({ completed: false }).toArray((error, results) => {
        if (error) {
            return console.log("Unable to find tasks!")
        }
        console.log(results)
    }) */

    //UPDATE
    /* const updatePromise = db.collection('users').updateMany({ name: "Sammoooo2" }, { $set: { name: 'Sammoooo2' }, $inc: { age: 23 } })

    updatePromise.then((result) => {
        console.log("Updating result: " + JSON.stringify(result))
    }).catch((error) => {
        console.log("Error: " + error)
    }) */

    //DELETE
    /* db.collection('tasks').deleteOne({
        description: 'desc1'
    }).then((result) => {
        console.log('Deleting: ' + JSON.stringify(result))
    }).catch((error) => {
        console.log(error)
    }) */


})