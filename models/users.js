const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    otp: {
        type: String
    },
    verify: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    pdf: {
        type: String
    },
    userActiveStatus: {
        type: Number,
        default:1
    }
},
    {
        timestamps: true,
        versionKey: false
    })

module.exports = mongoose.model('users', userSchema)