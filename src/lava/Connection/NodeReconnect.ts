import Lava from "../../structures/Lava";
import MeeS from "../../structures/Client";
import { Node } from "erela.js";
import Logger from "../../class/Logger";

export default class NodeReconnect extends Lava {
    constructor(client: MeeS) {
        super(client, {
            name: 'nodeReconnect'
        })
    }

    async run(node: Node) {
        Logger.log("WARNING", `Node Reconnect: ${node.options.identifier}.`);
    }
}