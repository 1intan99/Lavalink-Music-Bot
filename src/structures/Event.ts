import { ClientEvents } from "discord.js";
import DiscordClient from "./Client";

export default abstract class Event {
    readonly client: DiscordClient;
    readonly name: keyof ClientEvents;

    constructor(client: DiscordClient, name: keyof ClientEvents) {
        this.client = client;
        this.name = name;
    }

    abstract exec(...params: any | undefined): Promise<any>;
}
