import Lava from "../../structures/Lava";
import DiscordClient from "../../structures/Client";
import Logger from "../../class/Logger";
import { Node } from "erela.js";

export default class nodeConnect extends Lava {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'nodeConnect'
        })
    }

    async run(node: Node) {
        Logger.log("SUCCESS", `Node Connected: ${node.options.identifier}`);
    }
}