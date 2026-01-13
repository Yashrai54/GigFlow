import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    budget:{
        type:Number,
        required:true
    },
    status:{
        type: String,
        enum:["Open","Assigned"],
        default:"Open"
    }
})

const ProjectModel = await mongoose.model("Project",ProjectSchema)

export default ProjectModel