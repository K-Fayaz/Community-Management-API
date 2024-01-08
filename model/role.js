const mongoose = require("mongoose");
const { Schema , model } = mongoose;


const roleSchema = new Schema({
    _id: {
        type:String,
        required: true,
    },
    name: {
        type:String,
        required: true,
    },
    crated_at: {
        type:Date,
        default: Date.now(),
    },
    updated_at:{
        type: Date,
        default: Date.now(),
    }
});


const Role = model('Role',roleSchema);
module.exports = Role;