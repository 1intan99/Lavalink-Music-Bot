import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Payload, Player, Track } from "erela.js";
import Logger from "../../class/Logger";
import { TextBasedChannels } from "discord.js-light";

export default class TrackStuck extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: "trackStuck"
        });
    }

    async run(player: Player, track: Track, payload: Payload) {
        player?.stop();
        player.set("trackErr", true);

        setTimeout(async () => {
            const channel = this.client.channels.cache.get(player.textChannel as string) as TextBasedChannels;
            const message = channel.messages.cache.get(player.get("currentMessageId"));
            message?.delete();
        }, 1e3)
    }
}