import Lava from "../../structures/Lava";
import MeeS from "../../structures/Client";
import { Player, WebSocketClosedEvent } from "erela.js";
import Logger from "../../class/Logger";
import { MessageEmbed, TextBasedChannels } from "discord.js-light";

export default class socketClosed extends Lava {
    constructor(client: MeeS) {
        super(client, {
            name: 'socketClosed'
        })
    }

    async run(player: Player, socket: WebSocketClosedEvent) {
        Logger.log("WARNING", `ErelaSocket From: ${this.client.guilds.cache.get(socket.guildId)?.name}`);
        const channel = this.client.channels.cache.get("923819496261681192") as TextBasedChannels;
        const embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor("❌ Error | WebSocketClosedEvent", this.client.user?.displayAvatarURL())
        .addField("**From**", this.client.guilds.cache.get(socket.guildId)?.name as string, true)
        .addField("**Reason**", socket.reason, true)
        .addField("**Code**", `${socket.code}`, true)
        .addField("**By Remote**", `${socket.byRemote}`, true)
        channel.send({ embeds: [embed] });
    }
}