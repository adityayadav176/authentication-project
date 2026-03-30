import mongoose from "mongoose";
import { DB_NAME } from "../contant.js";

const connectToMongo = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDb Connected Successfully`)
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR", error);
        process.exit(1)
    }
}

export default connectToMongo