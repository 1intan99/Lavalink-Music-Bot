import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { MessageEmbed, Message } from "discord.js-light";

export default class Stop extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'stop',
            description: 'Stop the music',
            group: 'Music',
            examples: ['stop'],
            cooldown: 3
        });
    }

    async exec(message: Message) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "❌ Error | Voice Channel" })
            .setDescription("You're not in voice channel, make sure you join voice channel in somewhere")
            message.channel.send({ embeds: [embed] });
            return;
        }

        const player = this.client.manager?.players.get(message.guildId as string);
        if (!player) return message.channel.send(`There is no music play at this server!`);
        player.destroy();
        await message.react('✅')
        return message.channel.send(`Music has been stoped!`);
    }
}