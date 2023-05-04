const mongoose = require('mongoose')

const columnInfoSchema = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    beatArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BeatArea',
        required: true
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    archived: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String
    },
    officerInCharge: {
        type: String
    },
    name: {
        type: String
    },
    schoolFor: {
        type: String,
        enum: ['boys', 'girls', 'both']
    },
    boardingFacility: {
        type: String,
        enum: ['yes', 'no']
    },
    address: {
        type: String
    },
    date: {
        type: Date
    },
    totalEmployees: {
        type: String
    },
    permissionsAvailable: {
        type: String
    },
    tenantServantFormFilled: {
        type: String,
        enum: ['yes', 'no']
    },
    numberOfCamerasInstalled: {
        type: String
    },
    numberOfCamerasWorking: {
        type: String
    },
    numberOfTwoWheelersRented: {
        type: String
    },
    numberOfFourWheelersRented: {
        type: String
    },
    modusOperandi: {
        type: String
    },
    numberOfHistorySheet: {
        type: String
    },
    heads: {
        type: String
    },
    details: {
        type: String
    },
    crimeNumber: {
        type: String
    },
    disposal: {
        type: String
    }
}, {
    timestamps: true
})

columnInfoSchema.index({ geometry: '2dsphere' })

module.exports = {
    ColumnInfo:
    mongoose.model("ColumnInfo", columnInfoSchema)
}