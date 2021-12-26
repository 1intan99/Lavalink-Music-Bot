import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Player } from "erela.js";

export default class PlayerMove extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: "playerMove"
        });
    }

    async run(player: Player, oldChannel: string, newState: string) {
        if (!newState) {
            await player.destroy();
        } else {
            console.log(newState);
            player.setVoiceChannel(newState);

            if (player.paused) return;
            setTimeout(() => {
                player.pause(true);
                setTimeout(() => player.pause(false), this.client.ws.ping * 2);
            }, this.client.ws.ping * 2);
        }
    }
}