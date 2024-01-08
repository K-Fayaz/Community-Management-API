const mongoose = require("mongoose")
const {Schema,model} = mongoose;


const userSchema = new Schema({
    _id:{
        type:String,
        required: true,
    },
    name: {
        type:String,
        required: true,
        // default: null,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password: {
        type:String,
        required: true,
    },
    created_at:{
        type:Date,
        default: Date.now(),
    },
});


const User = model('User',userSchema);
module.exports = User;