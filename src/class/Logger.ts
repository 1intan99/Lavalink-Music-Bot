/* eslint-disable @typescript-eslint/no-extraneous-class */
import chalk from "chalk";
import moment from "moment";
import { LogType } from "../utils/logger-types";

export default class Logger {
    static log(type: LogType, message: string, space = false, format = "DD/MM/YYY HH:mm:ss") {
        let color: "green" | "yellow" | "red" | "blue";

        switch (type) {
            case "SUCCESS":
                color = "green";
                break;
            case "WARNING":
                color = "yellow";
                break;
            case "ERROR":
                color = "red";
                break;
            case "INFO":
                color = "blue";
        }

        console.log(`${space ? "\n" : ""}${chalk.magenta(`${moment().format(format)}`)} ${chalk[color].bold(`${type}`)} ${message}${space ? "\n" : ""}`);
    }
}
