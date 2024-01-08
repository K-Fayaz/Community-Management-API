const mongoose = require("mongoose");
const { Schema , model } = mongoose;


const memberSchema = new Schema({
    _id: {
        type:String,
        required: true,
    },
    community:{
        type: mongoose.Schema.Types.String,
        required: true,
        ref:"Community",
    },
    user:{
        type: mongoose.Schema.Types.String,
        required: true,
        ref:"User",
    },
    role:{
        type: mongoose.Schema.Types.String,
        required: true,
        ref:"Role",
    },
    created_at:{
        type:Date,
        default: Date.now(),
    }
});


const Member = model('Member',memberSchema);

module.exports = Member;