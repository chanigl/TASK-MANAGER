const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    id:{
        type:Number,
        required:true,
        unique:true
    },
    users: 
    {
        type:[Number],
        default:[]
        
    }
})

module.exports = mongoose.model("task", taskSchema)