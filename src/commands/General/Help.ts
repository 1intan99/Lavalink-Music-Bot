import { Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { formatSeconds } from "../../utils/client-functions";

interface IGroup {
    name: string;
    commands: string[];
}

export default class HelpCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: "help",
            group: "General",
            description: "Shows information about commands and groups.",
            cooldown: 30
        });
    }

    getAvailableGroups(message: Message): IGroup[] {
        const registry = this.client.register;
        const groupKeys = registry.getAllGroupNames();
        const groups: IGroup[] = [];

        groupKeys.forEach((group: string) => {
            const commandsInGroup = registry.findCommandsInGroup(group) as string[];
            const commands: string[] = [];

            commandsInGroup.forEach(commandName => {
                const command = registry.findCommand(commandName) as Command;
                if (!command.isUsable(message)) return;
                commands.push(commandName);
            });

            if (commands.length) groups.push({ name: group, commands });
        });

        return groups;
    }

    async sendHelpMessage(message: Message, groups: IGroup[]) {
        const embed = new MessageEmbed({
            color: "BLUE",
            title: "Help",
            footer: {
                text: `Type "${this.client.config.prefix}help [command-name]" for more information.`
            }
        });

        groups.forEach(group => embed.addField(`${group.name} Commands`, group.commands.map((x: any) => `\`${x}\``).join(" ")));
        await message.channel.send({ embeds: [embed] });
    }

    async exec(message: Message, args: string[]) {
        const groups = this.getAvailableGroups(message);

        if (!args[0]) return await this.sendHelpMessage(message, groups);

        const command = this.client.register.findCommand(args[0].toLocaleLowerCase());
        if (!command) return await this.sendHelpMessage(message, groups);
        let isAvailable = false;

        groups.forEach(group => {
            if (group.commands.includes(command.info.name)) isAvailable = true;
        });

        if (typeof isAvailable !== "undefined") return await this.sendHelpMessage(message, groups);

        const embed = new MessageEmbed({
            color: "BLUE",
            title: "Help",
            fields: [
                {
                    name: "Name",
                    value: command.info.name
                },
                {
                    name: "Group",
                    value: command.info.group
                },
                {
                    name: "Cooldown",
                    value: command.info.cooldown ? formatSeconds(command.info.cooldown) : "No cooldown"
                },
                {
                    name: "Usable At",
                    value: command.info.onlyNsfw ? "NSFW channels" : "All text channels"
                },
                {
                    name: "Aliases",
                    value: command.info.aliases ? command.info.aliases.map((x: any) => `\`${x}\``).join(" ") : "No aliases"
                },
                {
                    name: "Example Usages",
                    value: command.info.examples ? command.info.examples.map((x: any) => `\`${x}\``).join("\n") : "No examples"
                },
                {
                    name: "Description",
                    value: command.info.description ? command.info.description : "No description"
                }
            ]
        });

        if (command.info.require) {
            if (command.info.require.developers) embed.setFooter("This is a developer command.");
            if (command.info.require.userPermissions) embed.addField("Permission Requirements", command.info.require.userPermissions.map((x: any) => `\`${x}\``).join("\n"));
        }

        await message.channel.send({ embeds: [embed] });
    }
}
