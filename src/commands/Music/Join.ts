import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js-light";

export default class JoinCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: "join",
            description: "Invite bot to join your voice channel",
            examples: ["join"],
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

        let player = this.client.manager.players.get(message.guildId as string);
        if (player) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Voice Channel")
            .setDescription(`Hey ${message.author}, I'm already in voice channal, you can join in the same voice channel as me in <#${player.voiceChannel}>`)
            message.channel.send({ embeds: [embed] });
            return;
        }

        player = await this.client.manager.create({
            guild: message.guildId as string,
            voiceChannel: channel.id as string,
            textChannel: message.channel.id as string,
            selfDeafen: true,
            volume: 50
        });

        if (player.state !== "CONNECTED") {
            await player.connect();
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("✅ Successful | Joined Voice Channel!")
            .setDescription(`I've been invited by ${message.author} to join <#${player.voiceChannel}>, now you can request any music and let me play for you.`)
            message.channel.send({ embeds: [embed] });
            return;
        } else {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Voice Channel")
            .setDescription(`Hey ${message.author}, I'm already in voice channal, you can join in the same voice channel as me in <#${player.voiceChannel}>`)
            message.channel.send({ embeds: [embed] });
            return;
        }
    }
}