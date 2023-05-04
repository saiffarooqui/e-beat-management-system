const mongoose = require('mongoose')

const beatAreaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    policeStation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PoliceStation',
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Polygon'],
            default: 'Polygon'
        },
        coordinates: {
            type: [[[Number]]],
            required: true
        }
    }
}, {
    timestamps: true
})

beatAreaSchema.index({ geometry: '2dsphere' })

const tableSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    columns: [{
        columnName: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

const dataSchema = new mongoose.Schema({
    image_url: {
        type: String,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum:['danger', 'suspect', 'safe'],
        required:true
    },
    geometry:{
      type:{
          type:String,
          enum:['Point'],
          default:'Point'
      },
      coordinates:{
          type:[Number],
          required:true
      }
  },
  columnInfo:{
      type : mongoose.Schema.Types.ObjectId,
      ref:'ColumnInfo',
      required:true
  },
  user:{
      type : mongoose.Schema.Types.ObjectId,
      ref:'Users',
      required:true
  }
}, {
    timestamps: true
})

dataSchema.index({ geometry: '2dsphere' })

const assignSchema = new mongoose.Schema({
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    beatArea: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BeatArea',
        required: true
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    active: {
        type: Boolean,
        default: true
    }
    }, {
    timestamps: true
})

module.exports = {
    BeatArea:
    mongoose.model("BeatArea", beatAreaSchema),
    Table:
    mongoose.model("Table", tableSchema),
    Data:
    mongoose.model("Data", dataSchema),
    Assign:
    mongoose.model("Assign", assignSchema)
}