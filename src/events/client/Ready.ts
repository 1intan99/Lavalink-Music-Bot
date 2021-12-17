import Logger from "../../class/Logger";
import Event from "../../structures/Event";
import DiscordClient from "../../structures/Client";

export default class Ready extends Event {
    constructor(client: DiscordClient) {
        super(client, "ready");
    }

    async exec() {
        await this.client.manager?.init(this.client.user?.id);
        this.client.user?.setActivity(`${this.client.config.prefix}help`, { type: "PLAYING" });
        Logger.log("SUCCESS", `${this.client.user?.tag} is online!`);
    }
}
