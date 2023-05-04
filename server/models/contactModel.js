const mongoose = require('mongoose')

const contactBookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    createdBy: {
        type : mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }
}, {
    timestamps: true
})

module.exports = {
    ContactBook:
    mongoose.model("ContactBook", contactBookSchema)
}