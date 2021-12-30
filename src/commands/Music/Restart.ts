import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js-light";

export default class RestartCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, { 
            name: "restart",
            aliases: ["rs"],
            description: "To restart the music from begining",
            examples: ["restart", "rs"],
            group: "Music",
            cooldown: 3
        });
    }

    async exec(message: Message) {
        const channel = message.member?.voice.channel;
        if (!channel) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Erro | Voice Channel")
            .setDescription("You're not in voice channel, make sure you join voice channel in somewhere")
            message.channel.send({ embeds: [embed] });
            return;
        }

        const player = this.client.manager.players.get(message.guildId as string);

        if (!player) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Erro | No Player")
            .setDescription("There is no music playing here, make sure ther some music in queue so i can run this action.")
            message.channel.send({ embeds: [embed] });
            return;
        }

        player.seek(0);
        await message.react("✅");
        return;
    }
}