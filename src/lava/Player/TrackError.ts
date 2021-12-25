import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Player, Track, TrackExceptionEvent } from "erela.js";
import { TextBasedChannels } from "discord.js-light";

export default class TrackError extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: "trackError"
        });
    }

    async run(player: Player, track: Track, payload: TrackExceptionEvent) {
        player?.stop();
        player.set("trackErr", true);

        setTimeout(async () => {
            const channel = this.client.channels.cache.get(player.textChannel as string) as TextBasedChannels;
            const message = channel.messages.cache.get(player.get("currentMessageId"));
            message?.delete();
        }, 1e3)
    }
}