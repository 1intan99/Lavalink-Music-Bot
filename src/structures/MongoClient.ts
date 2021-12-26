import mongoose from "mongoose";
import Logger from "../class/Logger";

export default class Mongod {

    async connect() {
        mongoose.connect(process.env.MONGOD as string);
        mongoose.connection
        .on("connected", () => {
            Logger.log("SUCCESS", "MongoDB Successfully Connected");
        })
        .on("err", (err) => {
            Logger.log("ERROR", `MongoDB Connection error: ${err.stack}`);
        })
        .on("disconnected", () => {
            Logger.log("WARNING", "MongoDB Disconnected");
        });
    }
}