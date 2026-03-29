import mongoose from "mongoose";
import { DB_NAME } from "../contant.js";

const connectToMongo = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`mongodb connected successfully db host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB CONNECTION ERROR", error);
        process.exit(1)
    }
}

export default connectToMongo