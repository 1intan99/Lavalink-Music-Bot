import MeeS from "../structures/Client";
import { Manager } from "erela.js";
import { LavasfyClient } from "lavasfy";
import Deezer from "erela.js-deezer";
import Apple from "erela.js-apple";
import Facebook from "erela.js-facebook"

export default class Lavalink {
    readonly client: MeeS;
    constructor(client: MeeS) {
        this.client = client;
    }

    async connect() {
        const client = this.client;
        const { clientID , clientSecret } = process.env;
        client.lavasfy = new LavasfyClient(
            {
                clientID: clientID as string,
                clientSecret: clientSecret as string,
                playlistLoadLimit: 5,
                audioOnlyResults: true,
                autoResolve: true,
                useSpotifyMetadata: true
            }, [
                {
                    id: 'KiaraLavalink',
                    host: process.env.HOST as string,
                    port: 443,
                    password: process.env.PASSWORD as string,
                    secure: true 
            }
        ]);
        client.manager = new Manager({
            plugins: [
                new Deezer({ albumLimit: 5, playlistLimit: 5 }),
                // @ts-ignore
                new Apple(),
                new Facebook()
            ],
            nodes: [
                {
                    identifier: 'Kiara Lavalink',
                    host: process.env.HOST as string,
                    port: 443,
                    password: process.env.PASSWORD as string,
                    secure: true
                }
            ],
            send(id, payload) {
                const guild = client.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            }
        });
    }
}