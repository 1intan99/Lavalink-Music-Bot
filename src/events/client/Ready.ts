import Logger from "../../class/Logger";
import Event from "../../structures/Event";
import DiscordClient from "../../structures/Client";

export default class Ready extends Event {
    constructor(client: DiscordClient) {
        super(client, "ready");
    }

    async exec() {
        this.client.manager?.init(this.client.user!.id);
        Logger.log("SUCCESS", `${this.client.user?.tag} is online!`);
    }
}
