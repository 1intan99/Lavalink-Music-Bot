import { Client, IntentsString } from "discord.js-light";
import { BotConfig } from "../utils/client-interface";
import { LavasfyClient } from "lavasfy";
import { Manager } from "erela.js";
import Register from "../class/Register";
import { ICache } from "../utils/lavalink-interface";

declare module "discord.js" {
    interface Client {
        config: BotConfig;
        register: Register;
        lavasfy: LavasfyClient;
        manager: Manager;
        cache: Map<string, ICache>
    }
}

export default class DiscordClient extends Client {
    constructor(intents: IntentsString[]) {
        super({ intents });
    }

    private async init(): Promise<void> {
        this.config = {
            token: process.env.TOKEN as string,
            prefix: process.env.PREFIX as string,
            developers: JSON.parse(process.env.DEVELOPERS as string),
            unknownErrorMessage: false
        };
        this.register = new Register(this);
        this.register.registerAll();
    }

    public async start(): Promise<void> {
        await this.init();
        await this.login(this.config.token);
    }
}
