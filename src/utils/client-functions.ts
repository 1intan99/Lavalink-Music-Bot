import moment from "moment";
import AutoPoster from "topgg-autoposter";
import Logger from "../class/Logger";
import DiscordClient from "../structures/Client";
import BotClient from "../structures/Client";

const isConstructorProxyHandler = {
    construct() {
        return Object.prototype;
    }
};

export function isConstructor(func: any, _class: any) {
    try {
        new new Proxy(func, isConstructorProxyHandler)();
        if (!_class) return true;
        return func.prototype instanceof _class;
    } catch (err) {
        return false;
    }
}

export function isDevelopers(client: BotClient, userId: string) {
    return client.config.developers.includes(userId);
}

export function formatSeconds(seconds: number, format = "Y [year] M [month] W [week] D [day] H [hour] m [minute] s [second]"): string {
    const str = moment.duration(seconds, "seconds").format(format);
    const arr = str.split(" ");
    let newStr = "";
    arr.forEach((value, index) => {
        if (isNaN(parseInt(value))) return;
        const val = parseInt(value);
        if (val === 0) return;

        const nextIndex = arr[index + 1];
        newStr += `${value} ${nextIndex} `;
    });
    return newStr.trim();
}

export function formatBytes(bytes:number): string {
    if (bytes === 0) return '0 Bytes'
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export function topgg(token: string, client: DiscordClient) {
    const topgg = AutoPoster(token, client);
    topgg.on("posted", () => {
        Logger.log("SUCCESS", "Posted stats to Top.gg!");
    })
    .on("error", (err) => {
        Logger.log("ERROR", `There is some error: ${err.stack}`);
    });
}