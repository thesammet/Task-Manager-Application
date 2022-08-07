const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require('bcryptjs')
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
    }
})

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

const User = mongoose.model('User', userSchema)

module.exports = User 