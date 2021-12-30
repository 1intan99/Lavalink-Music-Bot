import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message, MessageEmbed, TextChannel } from "discord.js-light";
import { generateEmbed, generateSetup } from "../../utils/lavalink-function";
import { getAndUpdate, getModel } from "../../utils/client-functions";
import { IMusicInterface } from "../../Models";
import Logger from "../../class/Logger";

export default class SetupCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: "setup",
            aliases: ["st"],
            description: "Setup music in current channel!",
            group: "Settings",
            require:  { userPermissions: ["MANAGE_CHANNELS", "MANAGE_GUILD"], clientPermissions: ["MANAGE_CHANNELS", "SEND_MESSAGES"] },
            cooldown: 5
        });
    }

    async exec(message: Message, args: string[]) {
        
        const data = await getModel("IMusic", { guildId: message.guild?.id }) as IMusicInterface | void;
        
        if (!data) {
            const channel = message.mentions.channels.first() as TextChannel || this.client.channels.cache.get(args[0]) as TextChannel || message.guild?.channels.cache.find(x => x.name === args[0]) as TextChannel;
            if (!channel) {
                const embed = new MessageEmbed()
                .setColor("RED")
                .setAuthor("❌ Error | Missing Channel")
                .setDescription("Please mention the channel to complete the setup!")
                message.channel.send({ embeds: [embed] });
                return;
            }

            const gembed = generateSetup(message, this.client);
            const msg = await channel.send(gembed)
            const iMusic = new this.client.model.IMusic({
                guildId: message.guild!.id,
                channelId: channel.id,
                musicId: msg.id
            });
            iMusic.save();
            const embed = new MessageEmbed()
            .setColor("GREEN")
            .setAuthor("✅ Success | Music Setup")
            .setDescription(`Setting up music has done, and you can use me for your personal music provider for free at ${channel}.`)
            message.channel.send({ embeds: [embed] });
            return;
        } else {
            const channel = message.mentions.channels.first() as TextChannel || this.client.channels.cache.get(args[0]) as TextChannel || message.guild?.channels.cache.find(x => x.name === args[0]) as TextChannel;
            if (!channel) {
                const embed = new MessageEmbed()
                .setColor("RED")
                .setAuthor("❌ Error | Missing Channel")
                .setDescription("Please mention the channel to complete the setup!")
                message.channel.send({ embeds: [embed] });
                return;
            }

            (await channel.messages.fetch(data.musicId)).delete().catch(err => Logger.log("ERROR", err));
            const embed = new MessageEmbed()
            .setColor("RED")
            .setAuthor("⏰ Waiting | Please Wait")
            .setDescription(`Please wait, let me deleting the message at ${channel} and send the new one.`)
            const m = await message.channel.send({ embeds: [embed] });

            setTimeout(async () => {
                const gembed = generateSetup(message, this.client);
                const msg = await channel.send(gembed);
                const iMusic = await getAndUpdate("IMusic", { guildId: message.guild?.id, channelId: channel.id, musicId: msg.id });
                iMusic?.save();
    
                embed.setColor("GREEN")
                embed.setAuthor("✅ Success | Music Setup")
                embed.setDescription(`Setting up music has done, and you can use me for your personal music provider for free at ${channel}.`)
                m.edit({ embeds: [embed] });
                return;   
            }, 5e3)         
        }
    }
}