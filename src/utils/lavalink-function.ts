import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from "discord.js-light";
import Logger from "../class/Logger";
import DiscordClient from "../structures/Client";
import load from "lodash";

export async function button(client: DiscordClient, guild: string) {
    const player = client.manager?.players.get(guild);
    const skip = new MessageButton()
    .setLabel(`⏭ Next`)
    .setStyle('PRIMARY')
    .setDisabled(!player?.playing)
    .setCustomId(`btn-next`)
    const pauseButton = new MessageButton()
    .setLabel(`⏯ Pause/Resume`)
    .setStyle(`PRIMARY`)
    .setCustomId(`btn-pause`)
    const stopButton = new MessageButton()
    .setLabel('⏹️ Stop')
    .setStyle("DANGER")
    .setCustomId("btn-leave");
    const repeatButton = new MessageButton()
    .setLabel("🔂 Repeat Queue")
    .setDisabled(!player?.playing)
    .setStyle("PRIMARY")
    .setCustomId("btn-controls");

    const row1 = new MessageActionRow().addComponents(
        skip,
        pauseButton,
        stopButton,
        repeatButton
    );
    const queueButton = new MessageButton()
    .setLabel("📜 Queue")
    .setStyle("PRIMARY")
    .setCustomId("btn-queue");
    const mixButton = new MessageButton()
    .setLabel("🎛️ Shuffle")
    .setDisabled(!player?.playing)
    .setStyle("PRIMARY")
    .setCustomId("btn-mix");
    const controlsButton = new MessageButton()
    .setLabel("🔂 Repeat Track")
    .setStyle("PRIMARY")
    .setDisabled(!player?.playing)
    .setCustomId("btn-repeat");

    const row2 = new MessageActionRow().addComponents(
        queueButton,
        mixButton,
        controlsButton
    );
    return [row1, row2];
}

export function convertTime(duration: number): number | unknown {

    let milliseconds = parseInt((duration as any % 1000 as any) / 100 as any)
    let    seconds = parseInt((duration as any / 1000 as any) % 60 as any) as any
    let   minutes = parseInt((duration as any / (1000 * 60) as any) % 60 as any) as any
    let    hours = parseInt((duration as any / (1000 * 60 * 60) as any) % 24 as any) as any;

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (duration < 3600000) {
        return minutes + ":" + seconds ;
    } else {
        return hours + ":" + minutes + ":" + seconds ;
    }
}

export async function queue(interaction: ButtonInteraction, client: DiscordClient) {
    try {
        const player = client.manager?.players.get(interaction.guildId as string);
        const currentTrack = player?.queue.current;
    
        if (!player?.playing || !currentTrack) {
            const pMsg = interaction.reply('Could not process queue atm, try later!');
            if (pMsg instanceof CommandInteraction) {
                setTimeout(() => pMsg.deleteReply(), 3e3);
            }
            return;
        }
    
        if (player.queue.length === 0 || !player.queue.length) {
            const embed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Now playing [${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}`);
    
            await interaction.channel?.send({ embeds: [embed] }).catch(() => {});
        } else {
            const queue = player.queue.map((track, index) => `\`${++index}\` - [${track.title}](${track.uri}) \`[${convertTime(track.duration as number)}]\` - ${track.requester}`);
    
            const mapping = load.chunk(queue, 10);
            const pages = mapping.map((s) => s.join("\n"));
            let page = 0;
    
            if (player.queue.size < 11) {
                const embed = new MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                .setTimestamp()
                .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                .setTitle(`${interaction.guild?.name} Queue`);
    
                await interaction.channel?.send({ embeds: [embed] }).catch(() => {});
            } else { 
                const embed = new MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                .setTimestamp()
                .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                .setTitle(`${interaction.guild?.name} Queue`);
    
                const forward = new MessageButton()
                .setCustomId("btn-forward")
                .setEmoji("⏭️")
                .setStyle("PRIMARY")
    
                const backward = new MessageButton()
                .setCustomId("btn-backward")
                .setEmoji("⏮️")
                .setStyle("PRIMARY")
    
                const end = new MessageButton()
                .setCustomId("btn-end")
                .setEmoji("⏹️")
                .setStyle("DANGER")
    
                const row1 = new MessageActionRow().addComponents([ backward, end, forward ]);
                const msg = await interaction.channel?.send({ embeds: [embed], components: [row1] }).catch(() => {});
    
                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (b: MessageComponentInteraction) => {
                        if (b.user.id === interaction.member.user.id) return true;
                        else {
                            b.reply({ ephemeral: true, content: `Only **${interaction.member.user}** can use this button, if you want then you've to run the command again.`})
                            return false;
                        }
                    },
                    time: 6e4,
                    idle: 30e3
                });
    
                collector?.on("collect", async (button) => {
                    if (button.customId === "btn-forward") {
                        await button.deferUpdate().catch(() => {});
                        page = page + 1 < pages.length ? ++page : 0;
    
                        const embed = new MessageEmbed()
                        .setColor(`GREEN`)
                        .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                        .setTimestamp()
                        .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                        .setTitle(`${interaction.guild?.name} Queue`);
    
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch(() => {});
                    } else if (button.customId === "btn-backward") {
                        await button.deferUpdate().catch(() => {});
                        page = page > 0 ? --page : pages.length - 1;
    
                        const embed = new MessageEmbed()
                        .setColor(`GREEN`)
                        .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                        .setTimestamp()
                        .setFooter(`Page ${page + 1}/${pages.length}`, interaction.guild?.iconURL() as string)
                        .setTitle(`${interaction.guild?.name} Queue`);
    
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch((err) => {
                            Logger.log("ERROR", `There is some error: ${err.stack}`)
                        });
                    } else if (button.customId === "btn-end") {
                        await button.deferUpdate().catch(() => {});
                        collector.stop();
                    } else  return;
                });
    
                collector?.on("end", async () => {
                    await msg?.delete();
                })
            }
        }
    } catch (err) {
        console.log(err);
    }
}