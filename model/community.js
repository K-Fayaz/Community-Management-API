const mongoose = require("mongoose");
const { Schema , model } = mongoose;


const communitySchema = new Schema({
    _id:{
        type:String,
        required: true,
    },
    name: {
        type:String,
        required: true
    },
    slug:{
        type:String,
        required: true,
        unique: true,
    },
    owner:{
        type:mongoose.Schema.Types.String,
        required: true,
        ref:"User",
    },
    created_at:{
        type:Date,
        default: Date.now(),
    },
    updated:{
        type:Date,
        default: Date.now(),
    }
});


const Community = model("Community",communitySchema);
module.exports = Community;