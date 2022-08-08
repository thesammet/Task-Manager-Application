const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        //trim is delete the whole spaces
        trim: true
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 18) {
                throw new Error('Age must be greater than 18!')
            }
        },
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.default.isEmail(value)) {
                throw new Error('Email is not validated!')
            }
        },
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password can\'t contain "password"')
            }
        },
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//relationship with user
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


//toJSON proccess every apis without any call
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    //delete some fields
    delete userObject.password
    delete userObject.tokens
    delete userObject.__v

    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'test')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login user')
    }

    const isMatch = await bycrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login password')
    }
    return user
}

userSchema.pre('save', async function (next) {
    //this means this user.
    const user = this
    if (user.isModified('password')) {
        user.password = await bycrypt.hash(user.password, 8)
    }
    console.log('just before saving')
    next()
})

//delete user tasks when user removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User 