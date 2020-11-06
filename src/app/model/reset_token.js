const mongoose = require('../../config/db.config');

const ResetTokenSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
    },
    token:{
        type:String,
        required:true,
        select:false
    },
    expiration:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    updatedAt:{
        type:Date,
        default:Date.now,
    }
});

const ResetToken = mongoose.model('ResetToken',ResetTokenSchema);

module.exports = ResetToken;