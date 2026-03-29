import connectToMongo from "./db/db.js";
import dotenv from "dotenv"
import {app} from "./app.js"

dotenv.config({
    path: "./.env"
})

const port = process.env.PORT || 9000;

connectToMongo()
.then(() => {
    app.listen(port || 9001, () => {
        console.log(`server is running on port : ${port}`);
    })
})
.catch((err)=> {
    console.log("mongodb connection failed", err)
})