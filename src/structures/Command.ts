import { GuildMember, Message, TextChannel } from "discord.js-light";
import Logger from "../class/Logger";
import SentryLoggers from "../class/SentryLoggers";
import { isDevelopers } from "../utils/client-functions";
import { NaoCommandInterface } from "../utils/command-interface";
import DiscordClient from "./Client";

export default abstract class Command {
    readonly client: DiscordClient;
    readonly info: NaoCommandInterface;

    constructor(client: DiscordClient, info: NaoCommandInterface) {
        this.client = client;
        this.info = info;
    }

    async onError(message: Message, error: Error) {
        SentryLoggers.getInstance().BotLoggers(error);
        Logger.log("ERROR", `${error.stack}`);
        await message.channel.send({
            embeds: [{
                color: "RED",
                title: "❌ Error",
                description: `${message.author}, an error occured while running this command. Please try again later.`
            }]
        });
    }

    isUsable(message: Message, checkNsfw = false): boolean {
        if (this.info.enabled === false) return false;
        if (checkNsfw && this.info.onlyNsfw === true && !(message.channel as TextChannel).nsfw && !isDevelopers(this.client, message.author.id)) return false;
        if (this.info.require) {
            if (this.info.require.developers && !isDevelopers(this.client, message.author.id)) return false;
            if (this.info.require.userPermissions && !isDevelopers(this.client, message.author.id)) {
                const perms: string[] = [];
                this.info.require.userPermissions.forEach(permission => {
                    if ((message.member as GuildMember).permissions.has(permission)) return;
                    return perms.push(permission);
                });
                if (perms.length) return false;
            }
            if (this.info.require.clientPermissions) {
                const perms: string[] = [];
                this.info.require.clientPermissions.forEach(permissions => {
                    if ((message.guild?.me as GuildMember).permissions.has(permissions)) return;
                    return perms.push(permissions);
                });
                if (perms.length) return false;
            }
        }
        return true;
    }

    abstract exec(message: Message, args: string[], cancelCooldown?: () => void): Promise<any>;
}
