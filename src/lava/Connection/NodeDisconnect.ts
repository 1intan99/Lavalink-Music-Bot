import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Node } from "erela.js";
import Logger from "../../class/Logger";

export default class NodeDisconnect extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'nodeDisconnect'
        })
    }

    async run(node: Node) {
        Logger.log("ERROR", `Node Disconnected: ${node.options.identifier}`);
    }
}