import express from "express";
import par from "body-parser";
import cookieParser from "cookie-parser";
import { join } from "path";
import router from "../route";
import Logger from "../class/Logger";


export default class WebClient {

    async Main() {
        const app = express();

        app
        .use(cookieParser())
        .use(par.json())
        .use(par.urlencoded({ extended: true }))
        .use(express.static("./src/public"))
        .set("view engine", ".ejs")
        .set("views", join(__dirname, "..", "..", "views"))
        .set("port", process.env.PORT || 3000)
        .use("/", router)
        .listen(app.get("port"), () => {
            Logger.log("SUCCESS", `Website linstning on :::${app.get("port")}:::`);
        });

        process.on("uncaughtException", r => {
            console.dir(r);
        });
    }
}