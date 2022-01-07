import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Node } from "erela.js";
import Logger from "../../class/Logger";
import SentryLogger from "../../class/SentryLoggers";

export default class NodeError extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'nodeError'
        })
    }

    async run(node: Node, err: any) {
        SentryLogger.getInstance().BotLoggers(err)
        Logger.log(`ERROR`, err);
    }
}