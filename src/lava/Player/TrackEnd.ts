import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Player } from "erela.js";
import Logger from "../../class/Logger";
import { TextBasedChannels } from "discord.js";

export default class TrackEnd extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'trackEnd'
        });
    }

    async run(player: Player) {
        player.stop();
        const trackErr = player.get("trackErr") as boolean
        if (trackErr) return;
        const channel = this.client.channels.cache.get(player.textChannel as string) as TextBasedChannels;
        let message = channel.messages.cache.get(player.get("currentMessageId"))
        message?.delete().catch(err => Logger.log("ERROR", err));
    }
}