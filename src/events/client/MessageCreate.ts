import { Message } from "discord.js-light";
import CommandHandler from "../../class/CommandHandler";
import Event from "../../structures/Event";
import DiscordClient from "../../structures/Client";

export default class MessageCreate extends Event {
    constructor(client: DiscordClient) {
        super(client, "messageCreate");
    }

    async exec(message: Message) {
        if (message.author.bot || message.channel.type === "DM") return;
        await CommandHandler.handleCommand(this.client, message);
    }
}
