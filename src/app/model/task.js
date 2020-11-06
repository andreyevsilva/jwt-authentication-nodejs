const mongoose = require('../../config/db.config');
const bcrypt = require('bcryptjs');
const { mongo } = require('../../config/db.config');

const TaskSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
    },
    description:{
        type:String,
        require:true,
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
    },
    project:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
    },
    completed:{
        type:Boolean,
        require:true,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
    
});


const Task = mongoose.model('Task',TaskSchema);

module.exports = Task;