import Lava from "../../structures/Lava";
import MeeS from "../../structures/Client";
import { Node } from "erela.js";
import Logger from "../../class/Logger";
import SentryLogger from "../../class/SentryLoggers";

export default class NodeError extends Lava {
    constructor(client: MeeS) {
        super(client, {
            name: 'nodeError'
        })
    }

    async run(node: Node, err: any) {
        SentryLogger.getInstance().BotLoggers(err.reason)
        Logger.log(`ERROR`, err.reason);
    }
}