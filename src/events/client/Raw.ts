import MeeS from "../../structures/Client";
import Event from "../../structures/Event";

export default class RawEvent extends Event {
    constructor(client: MeeS) {
        // @ts-ignore
        super(client, 'raw')
    }

    async exec(d: any) {
        this.client.manager?.updateVoiceState(d);
    }
}