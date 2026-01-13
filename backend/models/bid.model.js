import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    projectId: {
        type:mongoose.Types.ObjectId,
        ref:"Project",
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    budget:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","hired","Rejected"]
    }
})

export const BidModel = mongoose.model("Bid",BidSchema)

