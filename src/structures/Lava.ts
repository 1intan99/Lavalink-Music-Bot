import { IManagerEvents } from "../utils/lavalink-interface";
import DiscordClient from "./Client";

export default abstract class Lava {
    readonly client: DiscordClient;
    readonly info: IManagerEvents;

    constructor (client: DiscordClient, info: IManagerEvents) {
        this.client = client,
        this.info = info;
    }

    abstract run(...params: any | undefined): Promise<any>;
}