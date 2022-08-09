const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { setupDatabase, userOneId, userOne } = require('./fixtures/db.js')

beforeEach(setupDatabase)

test('Should register a new user', async () => {
    const response = await request(app).post('/users').send({
        name: "samed test",
        email: "test@gmail.com",
        password: "test1234"
    }).expect(201)

    //Assertion to db change correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: "samed test",
            email: "test@gmail.com",
        },
        token: user.tokens[0].token,
    })
    expect(user.password).not.toBe('test1234')

})

test('Should login with an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)

    //Assertion to token match 2nd one
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should NOT login with non existing user', async () => {
    await request(app).post('/users/login').send({
        email: "nonexisting@jest.com",
        password: "nonexistingpassword"
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should NOT get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


test('Should delete account for user', async () => {
    await request(app).delete('/users/me')
        .send()
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull
})

test('Should NOT delete account for unauthenticated user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('Should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/batman-avatar.png')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))

})

test('Should update valid user fields', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jon Doe'
        }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Jon Doe')
})

test('Should NOT update invalid user fields', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Angara'
        }).expect(400)
})