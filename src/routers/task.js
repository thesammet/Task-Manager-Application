const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const taskId = req.params.id
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

//TASK UPDATE
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) {
            return res.status(404).send({ error: 'Task not found' })
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router