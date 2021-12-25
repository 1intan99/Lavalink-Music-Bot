import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import { Node } from "erela.js";
import Logger from "../../class/Logger";

export default class NodeCreate extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'nodeCreate'
        })
    }

    async run(node: Node) {
        Logger.log(`INFO`, `Node Created: ${node.options.identifier}`);
    }
}