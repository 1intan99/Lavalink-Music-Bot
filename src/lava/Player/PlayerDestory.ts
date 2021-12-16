import Lava from "../../structures/Lava";
import MeeS from "../../structures/Client";
import { Player, Track } from "erela.js";
import Logger from "../../class/Logger";
import { TextBasedChannels } from "discord.js";

export default class PlayerDestroy extends Lava {
    constructor(client: MeeS) {
        super(client, {
            name: 'playerDestroy'
        });
    }

    async run(player: Player) {
        const cache = this.client.cache.get(player.guild);
        if (!cache) return Logger.log(`WARNING`, "There is no music cache in here!");

        const channel = this.client.channels.cache.get(cache.channelId as string) as TextBasedChannels;
        (await channel.messages.fetch(cache.musicMessageId as string)).delete()
        this.client.cache.delete(player.guild);
    }
}