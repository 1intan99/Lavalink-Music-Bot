import { Guild, GuildMember, Message, TextChannel } from "discord.js-light";
import DiscordClient from "../structures/Client";
import { formatSeconds, isDevelopers } from "../utils/client-functions";
import SentryLoggers from "./SentryLoggers";

export default class CommandHandler {
    static async handleCommand(client: DiscordClient, message: Message) {
        const self = (message.guild as Guild).me as GuildMember;
        if (!self.permissions.has("SEND_MESSAGES") || !(message.channel as TextChannel).permissionsFor(self).has("SEND_MESSAGES")) return;

        const prefix = client.config.prefix;
        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixReg = new RegExp(`^(<@!?${client.user!.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixReg.test(message.content)) return;
        const [macthPrefix] = message.content.match(prefixReg) as any;
        if (message.content.toLocaleLowerCase().indexOf(macthPrefix) !== 0) return;
        const args = message.content.slice(macthPrefix.length).trim().split(/ +/g);
        const command = (args.shift() as string).toLowerCase();
        const cmd = client.register.findCommand(command);

        if (!cmd) {
            if (client.config.unknownErrorMessage) {
                await message.channel.send({
                    embeds: [{
                        color: "RED",
                        title: "⚠️ Unkown Command",
                        description: `${message.author}, Looks like i don't have that command. You can type \`${client.config.prefix}help\` to show all of my command.`
                    }]
                });
                return;
            }
        }

        if (cmd?.info.enabled === false) return;
        if (cmd?.info.onlyNsfw === true && !(message.channel as TextChannel).nsfw && !isDevelopers(client, message.author.id)) {
            await message.channel.send({
                embeds: [{
                    color: "RED",
                    title: "🔞 Eyy....",
                    description: `${message.author}, Yow yow yow. You can't use nsfw command at non-nsfw channels.`
                }]
            });
            return;
        }

        if (cmd?.info.require) {
            if (cmd.info.require.developers && !isDevelopers(client, message.author.id)) return;
            if (cmd.info.require.userPermissions && !isDevelopers(client, message.author.id)) {
                const perms: string[] = [];
                cmd.info.require.userPermissions.forEach(permission => {
                    if ((message.member as GuildMember).permissions.has(permission)) return;
                    return perms.push(`\`${permission}\``);
                });
                if (perms.length) {
                    await message.channel.send({
                        embeds: [{
                            color: "YELLOW",
                            title: "⚠️ Missing Permissions",
                            description: `${message.author}, You have no permission to run this command.\n\nPermission neded: \`${perms.join("\n")}\``
                        }]
                    });
                    return;
                }
            }
            if (cmd.info.require.clientPermissions) {
                const perms: string[] = [];
                cmd.info.require.clientPermissions.forEach(permissions => {
                    if ((message.guild as Guild).me?.permissions.has(permissions)) return;
                    return perms.push(`\`${permissions}\``);
                });
                if (perms.length) {
                    await message.channel.send({
                        embeds: [{
                            color: "YELLOW",
                            title: "⚠️ Missing Permissions",
                            description: `${message.author}, I have no permission to run this action.\n\nPermission neded: \`${perms.join("\n")}\``
                        }]
                    });
                    return;
                }
            }
        }

        let addColdown = false;

        const now = Date.now();
        const timestamp = client.register.getCooldownTimestamps(cmd?.info.name as string);
        const cooldownAmout = cmd?.info.cooldown ? cmd.info.cooldown * 1000 : 0;

        if (cmd?.info.cooldown) {
            if (timestamp.has(message.author.id)) {
                const currentTime = timestamp.get(message.author.id);
                if (!currentTime) return;

                const expTime = currentTime + cooldownAmout;
                if (now < expTime) {
                    if (message.deletable) {
                        await message.delete();
                        const timeLeft = (expTime - now) / 1000;
                        await message.channel.send({
                            embeds: [{
                                color: "RED",
                                title: "⏲️ Yow! Calm Down",
                                description: `${message.author}, You can run this command again in \`${formatSeconds(Math.floor(timeLeft))}\` just relax mate.`
                            }]
                        }).then(msg => setTimeout(async () => await msg.delete().catch(() => {}), 3000));
                        return;
                    }
                    await message.channel.send({
                        embeds: [{
                            color: "RED",
                            title: "⚠️ Missing Permissions",
                            description: `${message.author}, I have no permissions to delete this message.\n\n\Permissions neded: \`MANAGE_MESSAGE\``
                        }]
                    });
                    return;
                }
            }
            addColdown = true;
        }

        try {
            let applyCooldown = true;

            await cmd?.exec(message, args, () => {
                applyCooldown = false;
            });

            if (typeof addColdown !== "undefined" && typeof applyCooldown !== "undefined" && !isDevelopers(client, message.author.id)) {
                timestamp.set(message.author.id, now);
                setTimeout(() => timestamp.delete(message.author.id), cooldownAmout);
            }
        } catch (err: any) {
            SentryLoggers.getInstance().BotLoggers(err);
            await cmd?.onError(message, err);
        }
    }
}
