import Lava from "../../structures/Lava";
import MeeS from "../../structures/Client";
import { Player, Track } from "erela.js";
import { Message, MessageEmbed, TextBasedChannels } from "discord.js";
import { button, convertTime } from "../../utils/lavalink-function";

export default class TrackStart extends Lava {
    lastControlMessage: Message | undefined
    constructor(client: MeeS) {
        super(client, {
            name: 'trackStart'
        });
    }

    async run(player: Player, track: Track) {
            const channel = this.client.channels.cache.get(player.textChannel as string) as TextBasedChannels;
            const embed = new MessageEmbed()
            .setDescription(`**Playing**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]\` [${track.requester}]\nVolume: \`${player.volume}\`%\nQueue size: \`${player.queue.size}\``)
            .setTimestamp()
            .setImage(track.displayThumbnail("hqdefault") || "https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png")
            .setColor('GREEN')
            const msg = {
                embeds: [embed],
                components: [...await button(this.client, player.guild)]
            }
            const m = await channel.send(msg);
            this.client.cache.set(m.guildId as string, {
                channelId: m.channelId,
                musicMessageId: m.id
            });
    }
}