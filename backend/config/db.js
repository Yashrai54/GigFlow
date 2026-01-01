import mongoose from "mongoose";

async function ConnectDb(){
    await mongoose.connect(process.env.MONGO_URI)
}

export default ConnectDb