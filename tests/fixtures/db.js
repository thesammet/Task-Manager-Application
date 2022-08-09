const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Task = require('../../src/models/task')
const User = require('../../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = new User({
    _id: userOneId,
    name: "Samed",
    email: "samedtest@jest.com",
    password: "jest1234",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
})

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = new User({
    _id: userTwoId,
    name: "Hamid",
    email: "hamid@jest.com",
    password: "jest4567",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
})

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Any task',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Some task',
    completed: true,
    owner: userOne._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Best task',
    completed: false,
    owner: userTwo._id
}




const setupDatabase = async () => {
    //delete whole users&tasks before creating
    await User.deleteMany()
    await Task.deleteMany()
    await User(userOne).save()
    await User(userTwo).save()
    await Task(taskOne).save()
    await Task(taskTwo).save()
    await Task(taskThree).save()
}

module.exports = {
    setupDatabase,
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree
}