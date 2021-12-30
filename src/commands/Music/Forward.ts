import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js-light";
import { convertTime } from "../../utils/lavalink-function";

export default class ForwardCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: "forward",
            aliases: ["fw"],
            description: "Seeks music to specific amounr of seconds",
            examples: ["forward 3000<Seconds>", "fw 3000<Seconds>"],
            group: "Music",
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

        if (!args[0]) {
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("❌ Error | Missing Permissions")
            .setDescription("Please input the number<seconds> to forward the music")
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

        let seektime = player.position + Number(args[0]);

        if (Number(args[0]) <= 0) seektime =  player.position;

        if (seektime >= Number(player.queue.current?.duration)) seektime = Number(player.queue.current?.duration) - 1000;

        player.seek(seektime);

        const embed = new MessageEmbed()
        .setColor("GREEN")
        .setAuthor("✅ Successful | Seeking current music")
        .setDescription(`I've seek the music to [\`${convertTime(player.position)}\`]`)
        message.channel.send({ embeds: [embed] });
        return;
    }
}