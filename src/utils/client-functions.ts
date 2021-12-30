import "moment-duration-format";
import moment from "moment-timezone";
import AutoPoster from "topgg-autoposter";
import Logger from "../class/Logger";
import DiscordClient from "../structures/Client";
import BotClient from "../structures/Client";
import * as Models from "../Models";

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
    const arr = str.split(" ")
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

export async function getModel(model: keyof typeof Models, filter: Record<string, unknown>) {
    const data = await Models[model].findOne(filter);
    return data;
}

export async function getAndCreate(model: keyof typeof Models, filter: Record<string, unknown>) {
    let data = await Models[model].findOne(filter);
    if (!data) {
        data = new Models[model](filter)
    }
    return data;
}

export async function getAndUpdate(model: keyof typeof Models, filter: Record<string, unknown>) {
    let data = await Models[model].findOneAndUpdate(filter);
    return data;
}

export function delay(delayMs: number) {
    try {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(2);
            }, delayMs);
        });
    } catch (err: any) {
        Logger.log("ERROR", err.stack)
    }
}

export function escapeRegex(str: string) {
    try {
        return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
    } catch (err: any) {
        Logger.log("ERROR", err.stack);
    }
}