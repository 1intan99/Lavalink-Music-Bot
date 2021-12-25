import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Player } from "erela.js";
import Logger from "../../class/Logger";
import { TextBasedChannels } from "discord.js";

export default class PlayerDestroy extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'playerDestroy'
        });
    }

    async run(player: Player) {
        const channel = this.client.channels.cache.get(player.textChannel as string) as TextBasedChannels;
        const message = channel.messages.cache.get(player.get("currentMessageId"));
        message?.delete().catch(err => Logger.log("ERROR", err));
    }
}