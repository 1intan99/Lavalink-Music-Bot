import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message } from "discord.js";

export default class Stop extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'stop',
            description: 'Stop the music',
            group: 'Music',
            examples: ['stop']
        });
    }

    async exec(message: Message) {
        if (!message.member?.voice.channel) {
            message.channel.send(`You're not in voice channel!`);
        };

        const player = this.client.manager?.players.get(message.guildId as string);
        if (!player) return message.channel.send(`There is no music play at this server!`);
        player.destroy();
        await message.react('✅')
        return message.channel.send(`Music has been stoped!`);
    }
}