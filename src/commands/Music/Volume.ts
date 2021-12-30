import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { MessageEmbed, Message } from "discord.js-light";

export default class Volume extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'volume',
            aliases: ['vol'],
            group: 'Music',
            examples: ['volume 10<Number ( Max Volume 200)>'],
            cooldown: 3
        });
    }

    async exec(message: Message, args: string[]) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: "❌ Error | Voice Channel" })
            .setDescription("You're not in voice channel, make sure you join voice channel in somewhere")
            message.channel.send({ embeds: [embed] });
            return;
        }

        let vol = Number(args[0]);
        const maxVol = 200;
        if (!vol) return message.channel.send(`Please send me specific number`);
        else if (vol > maxVol) vol = 200;

        const player = this.client.manager?.players.get(message.guildId as string);
        if (!player) return message.channel.send(`There is no music play at this server!`);
        player?.setVolume(vol);

        return message.channel.send(`Volume set to: \`${vol}\`%`)
    }
}