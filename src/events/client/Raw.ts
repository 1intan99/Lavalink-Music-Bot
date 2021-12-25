import DiscordClient from "../../structures/Client";
import Event from "../../structures/Event";

export default class RawEvent extends Event {
    constructor(client: DiscordClient) {
        // @ts-ignore
        super(client, 'raw')
    }

    async exec(d: any) {
        this.client.manager?.updateVoiceState(d);
    }
}