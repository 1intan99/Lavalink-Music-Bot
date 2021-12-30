import { ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, User } from "discord.js-light";
import Logger from "../class/Logger";
import DiscordClient from "../structures/Client";
import load from "lodash";

export async function button(client: DiscordClient, guild: string) {
    const player = client.manager?.players.get(guild);
    const skip = new MessageButton()
    .setLabel(`⏭ Next`)
    .setStyle('PRIMARY')
    .setDisabled(!player?.playing)
    .setCustomId(`${client.user?.id}-btn-next`)
    const pauseButton = new MessageButton()
    .setLabel(`⏯ Pause/Resume`)
    .setStyle(`PRIMARY`)
    .setCustomId(`${client.user?.id}-btn-pause`)
    const stopButton = new MessageButton()
    .setLabel('⏹️ Stop')
    .setStyle("DANGER")
    .setCustomId(`${client.user?.id}-btn-leave`);
    const repeatButton = new MessageButton()
    .setLabel("🔂 Repeat Queue")
    .setDisabled(!player?.playing)
    .setStyle("PRIMARY")
    .setCustomId(`${client.user?.id}-btn-controls`);

    const row1 = new MessageActionRow().addComponents(
        skip,
        pauseButton,
        stopButton,
        repeatButton
    );
    const queueButton = new MessageButton()
    .setLabel("📜 Queue")
    .setStyle("PRIMARY")
    .setCustomId(`${client.user?.id}-btn-queue`);
    const mixButton = new MessageButton()
    .setLabel("🎛️ Shuffle")
    .setDisabled(!player?.playing)
    .setStyle("PRIMARY")
    .setCustomId(`${client.user?.id}-btn-mix`);
    const controlsButton = new MessageButton()
    .setLabel("🔂 Repeat Track")
    .setStyle("PRIMARY")
    .setDisabled(!player?.playing)
    .setCustomId(`${client.user?.id}-btn-repeat`);

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
                .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL:  interaction.guild?.iconURL() as string })
                .setTitle(`${interaction.guild?.name} Queue`);
    
                await interaction.channel?.send({ embeds: [embed] }).catch(() => {});
            } else { 
                const embed = new MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                .setTimestamp()
                .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL:  interaction.guild?.iconURL() as string })
                .setTitle(`${interaction.guild?.name} Queue`);
    
                const forward = new MessageButton()
                .setCustomId(`${client.user?.id}-btn-forward`)
                .setEmoji("⏭️")
                .setStyle("PRIMARY")
    
                const backward = new MessageButton()
                .setCustomId(`${client.user?.id}-btn-backward`)
                .setEmoji("⏮️")
                .setStyle("PRIMARY")
    
                const end = new MessageButton()
                .setCustomId(`${client.user?.id}-btn-end`)
                .setEmoji("⏹️")
                .setStyle("DANGER")
    
                const row1 = new MessageActionRow().addComponents([ backward, end, forward ]);
                const msg = await interaction.channel?.send({ embeds: [embed], components: [row1] }).catch(() => {});
    
                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (b: MessageComponentInteraction) => {
                        if (b.user.id === interaction.member?.user.id) return true;
                        else {
                            b.reply({ ephemeral: true, content: `Only **${interaction.member?.user}** can use this button, if you want then you've to run the command again.`})
                            return false;
                        }
                    },
                    time: 6e4,
                    idle: 30e3
                });
    
                collector?.on("collect", async (button) => {
                    if (button.customId === `${client.user?.id}-btn-forward`) {
                        await button.deferUpdate().catch(() => {});
                        page = page + 1 < pages.length ? ++page : 0;
    
                        const embed = new MessageEmbed()
                        .setColor(`GREEN`)
                        .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                        .setTimestamp()
                        .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL:  interaction.guild?.iconURL() as string })
                        .setTitle(`${interaction.guild?.name} Queue`);
    
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch(() => {});
                    } else if (button.customId === `${client.user?.id}-btn-backward`) {
                        await button.deferUpdate().catch(() => {});
                        page = page > 0 ? --page : pages.length - 1;
    
                        const embed = new MessageEmbed()
                        .setColor(`GREEN`)
                        .setDescription(`**Now Playing**\n[${player.queue.current?.title}](${player.queue.current?.uri}) \`[${convertTime(player.queue.current?.duration as number)}]\` - ${player.queue.current?.requester}\n\n**Queue Songs**\n${pages[page]}`)
                        .setTimestamp()
                        .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: interaction.guild?.iconURL() as string})
                        .setTitle(`${interaction.guild?.name} Queue`);
    
                        await msg?.edit({
                            embeds: [embed],
                            components: [row1]
                        }).catch((err) => {
                            Logger.log("ERROR", `There is some error: ${err.stack}`)
                        });
                    } else if (button.customId === `${client.user?.id}-btn-end`) {
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

export function generateEmbed(client: DiscordClient, guildId: string, leave?: boolean) {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const embeds = [
        new MessageEmbed()
        .setColor("RED")
        .setTitle(`📜 ${guild.name} Queue`)
        .setDescription(`**There is no queue here**`),
        new MessageEmbed()
        .setColor("RED")
        .setTitle(`No music playing here.`)
        .setImage("https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png")
        .setFooter({ text: client.user?.tag as string, iconURL: guild.iconURL({ dynamic: true}) as string})
    ]

    const player = client.manager.players.get(guild.id);

    if (!leave && player && player.queue && player.queue.current) {
        const requester = player.queue.current.requester as User
        embeds[1].setImage(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setColor("GREEN")
        .setFooter({ text: `Requested by: ${requester.tag}`, iconURL: requester.displayAvatarURL({ dynamic: true})})
        .addField("⏰ Duration:", `[\`${convertTime(player.queue.current.duration as number)}\`]`, true)
        .addField("🎀 Author:", `**${player.queue.current.author}**`, true)
        .addField("📜 Queue Length:", `[\`${player.queue.length}\`]`)
        .setTitle(player.queue.current.title)
        // @ts-expect-error string
        delete embeds[1].description;

        const track = player.queue;
        const maxTrack = 10;
        const songs = track.slice(0, maxTrack);

        embeds[0] = new MessageEmbed()
        .setTitle(`📜 ${guild.name} Queue [${player.queue.length} Tracks]`)
        .setColor("GREEN")
        .setDescription(`${songs.map((track, index) => `**\`${++index}\` - [${track.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.uri})** - \`${track.isStream ? "LIVE STREAM" : convertTime(track.duration as number)}\``).join("\n").substring(0, 2048)}`);

        if (player.queue.length > 10) {
            embeds[0].addField(`**\` N. \` *${player.queue.length > maxTrack ? player.queue.length - maxTrack : player.queue.length} other Tracks ...***`, `\u200b`)
            embeds[0].addField(`**\` 0. \` __CURRENT TRACK__**`, `**[${player.queue.current.title.substring(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.queue.current.uri})** - \`${player.queue.current.isStream ? `LIVE STREAM` : convertTime(player.queue.current.duration as number)}\`\n> *Requested by: ${requester.tag}**`)
        } 
    }


        let skip = new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-skip`).setEmoji(`⏭`).setLabel(`Skip`).setDisabled()
        let stop = new MessageButton().setStyle("DANGER").setCustomId(`${client.user?.id}-btn-ch-stop`).setEmoji(`⏹`).setLabel(`Stop`).setDisabled()
        let pause = new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-pauses`).setEmoji('⏯').setLabel(`Resume/Pause`).setDisabled()
        let shuffle = new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-shuffle`).setEmoji('🔀').setLabel(`Shuffle`).setDisabled()

        let repeats = new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeats`).setEmoji(`🔁`).setLabel(`Repeat Song`).setDisabled()
        let repeatq = new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeatq`).setEmoji(`🔂`).setLabel(`Repeat Queue`).setDisabled()
        let forward = new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-forward`).setEmoji('⏩').setLabel(`+10 Sec`).setDisabled()
        let rewind = new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-rewind`).setEmoji('⏪').setLabel(`-10 Sec`).setDisabled()


    if (!leave && player && player.queue && player.queue.current) {
        skip = skip.setDisabled(false);
        stop = stop.setDisabled(false);
        pause = pause.setDisabled(false);
        shuffle = shuffle.setDisabled(false);
        repeats = repeats.setDisabled(false);
        repeatq = repeatq.setDisabled(false);
        forward = forward.setDisabled(false);
        rewind = rewind.setDisabled(false);
    }

    const components = [
        new MessageActionRow().addComponents([
            skip,
            stop,
            pause,
            shuffle
        ]),
        new MessageActionRow().addComponents([
            repeats,
            repeatq,
            forward,
            rewind
        ])
    ]

    return {
        embeds,
        components
    }
}

export function generateSetup(message: Message, client: DiscordClient) {
    const embeds = [
        new MessageEmbed()
        .setColor("RED")
        .setTitle(`📜 ${message.guild?.name} Queue`)
        .setDescription(`**There is no queue here**`),
        new MessageEmbed()
        .setColor("RED")
        .setTitle(`No music playing here.`)
        .setImage("https://cdn.discordapp.com/attachments/891235330735366164/891387071376269342/amelia_corp.png")
        .setFooter({ text: client.user?.tag as string, iconURL: message.guild?.iconURL({ dynamic: true}) as string })
    ]

    const components = [
        new MessageActionRow().addComponents([
            new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-skip`).setEmoji(`⏭`).setLabel(`Skip`).setDisabled(),
            new MessageButton().setStyle("DANGER").setCustomId(`${client.user?.id}-btn-ch-stop`).setEmoji(`⏹`).setLabel(`Stop`).setDisabled(),
            new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-pauses`).setEmoji('⏯').setLabel(`⏯ Pause/Resume`).setDisabled(),
            new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-shuffle`).setEmoji('🔀').setLabel(`⏯ Pause/Resume`).setDisabled(),
        ]),
        new MessageActionRow().addComponents([
            new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeats`).setEmoji(`🔁`).setLabel(`Repeat Song`).setDisabled(),
            new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-repeatq`).setEmoji(`🔂`).setLabel(`Repeat Queue`).setDisabled(),
            new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-forward`).setEmoji('⏩').setLabel(`+10 Sec`).setDisabled(),
            new MessageButton().setStyle("PRIMARY").setCustomId(`${client.user?.id}-btn-ch-rewind`).setEmoji('⏪').setLabel(`-10 Sec`).setDisabled()
        ])
    ]

    return { embeds, components }
}