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
   location:{
    type:{
        type:String,
        enum:["Point"],
        required:true,
    },
    coordinates:{
        type:[Number],
        required:true
    }
   }
})
ProjectSchema.index({location:"2dsphere"})

const ProjectModel = await mongoose.model("Project",ProjectSchema)

export default ProjectModel