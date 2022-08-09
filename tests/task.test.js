const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task.js')
const { setupDatabase, userOneId, userOne, userTwo, taskOne, taskTwo, taskThree } = require('./fixtures/db.js')

beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request(app).post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Test case'
        })
        .expect(201)
    //Assertion - check for write to db
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should get all task valid user', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`).
        expect(200)

    //Assert user's task length
    expect(response.body.length).toEqual(2)
})

test('Attempting delete task invalid user', async () => {
    const response = await request(app).delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`).
        expect(404)

    //Assertion the task in db
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})