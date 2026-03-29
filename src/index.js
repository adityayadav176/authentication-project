import connectToMongo from "./db/db.js";
// require('dotenv').config({path: "./env"})
import dotenv from "dotenv"

dotenv.config({
    path: "./env"
})

connectToMongo()