import Command from "../../structures/Command";
import MeeS from "../../structures/Client";
import os from "os";
import { Message, MessageEmbed, version } from "discord.js-light";
import { convertTime } from "../../utils/lavalink-function";
import { formatBytes } from "../../utils/client-functions";

export default class Status extends Command {
    constructor(client: MeeS) {
        super(client, {
            name: "status",
            aliases: ["stats"],
            description: "To see statistic of this bot",
            examples: ['status'],
            group: "Info"
        })
    }

    async exec(message: Message) {
        const core = os.cpus()[0];
        const embed = new MessageEmbed()
        .setColor("GREEN")
        .addField('General', `
        **Servers:** \`${this.client.guilds.cache.size}\`
        **Users:** \`${this.client.guilds.cache.reduce((x, z) => x + z.memberCount, 0)}\`
        **Channels:** \`${this.client.channels.cache.size}\`
        **Node:** ${process.version}
        **Modules:** v${version}
        **Uptime:** \`${convertTime(this.client.uptime as number)}\``)
        .addField('System', `
        **Platform:** ${process.platform}
        **Uptime:** \`${convertTime(os.uptime())}\`
        **CPU:**
        \u3000 **Cores:** ${os.cpus().length}
        \u3000 **Model:** ${core.model}
        \u3000 **Speed:** ${core.speed}Mhz
        **Memory:**
        \u3000 **Heap:** ${formatBytes(process.memoryUsage().heapTotal)}
        \u3000 **Used:** ${formatBytes(process.memoryUsage().heapUsed)}`)
        .setTimestamp()

        message.channel.send({ embeds: [embed] });
    }
}