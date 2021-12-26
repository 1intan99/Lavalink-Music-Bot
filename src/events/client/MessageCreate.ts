import { Message } from "discord.js-light";
import CommandHandler from "../../class/CommandHandler";
import Event from "../../structures/Event";
import DiscordClient from "../../structures/Client";
import SentryLoggers from "../../class/SentryLoggers";
import Logger from "../../class/Logger";
import MusicHandler from "../../class/MusicHandler";

export default class MessageCreate extends Event {
    constructor(client: DiscordClient) {
        super(client, "messageCreate");
    }

    async exec(message: Message) {
        if (message.author.bot || message.channel.type === "DM") return;
        try {
            await CommandHandler.handleCommand(this.client, message);
            await MusicHandler.musicChannel(this.client, message);
        } catch (err: any) {
            SentryLoggers.getInstance().BotLoggers(err);
            Logger.log("ERROR", err);
        }
    }
}
