import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Player, WebSocketClosedEvent } from "erela.js";
import Logger from "../../class/Logger";

export default class socketClosed extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'socketClosed'
        })
    }

    async run(player: Player, socket: WebSocketClosedEvent) {
        Logger.log("WARNING", `ErelaSocket From: ${this.client.guilds.cache.get(socket.guildId)?.name}`);
    }
}