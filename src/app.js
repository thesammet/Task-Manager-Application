const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

//default page
app.use('/', (req, res) => {
    res.send('Task Manager API --> /users & /tasks')
})

module.exports = app