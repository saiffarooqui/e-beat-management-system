const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    district: {
        type: String,
        enum: ['north', 'south']
    },
    designation: {
        type: String,
        enum: ['sp', 'dsp', 'pi', 'psi', 'hc', 'constable', 'admin']
    },
    subDivision: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDivision'
    },
    policeStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoliceStation'
        // north goa police stations list
        // 'Panaji', 'OldGoa', 'Agacaim', 'Mapusa', 'Anjuna', 'Pernem', 'Colvale', 'Porvorim', 'Calangute', 'Saligao', 'Bicholim', 'Valpoi' 
        // south goa police stations list
        // 'MargaoTown', 'MainaCurtorim', 'Fatorda', 'Colva', 'Cuncolim', 'Quepem', 'Curchorem', 'Sanguem', 'Canacona', 'Vasco', 'Verna', 'VascoRailway', 'DabolimAirport', 'Mormagoa', 'Ponda', 'Collem'
    },
    otp: {
        type: String,
        required: true
    },
    otpCreatedAt: {
        type: Date
    },
    verified: {
        type: Boolean,
        default: false
    },
    archived: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/saifmsf/image/upload/v1662039097/avatar/avatar_pamsno.png"
    },
    registered: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const subDivisionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    district: {
        type: String,
        enum: ['north', 'south']
    }
}, {
    timestamps: true
})

const policeStationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subDivision: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDivision',
        required: true
    }
}, {
    timestamps: true
})

module.exports = {
    Users:
    mongoose.model("Users", userSchema),
    SubDivision:
    mongoose.model("SubDivision", subDivisionSchema),
    PoliceStation:
    mongoose.model("PoliceStation", policeStationSchema)
}