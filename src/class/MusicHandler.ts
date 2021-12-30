import { ButtonInteraction, Interaction, Message, MessageEmbed, SelectMenuInteraction } from "discord.js-light";
import { TrackUtils } from "erela.js";
import { LavalinkTrack } from "lavasfy";
import { IMusicInterface } from "../Models";
import DiscordClient from "../structures/Client";
import { delay, getModel } from "../utils/client-functions";
import { bass, party, pop, radio, soft, trablebass } from "../utils/lavalink-config";
import { convertTime, generateEmbed, queue } from "../utils/lavalink-function";
import Logger from "./Logger";

export default class MusicHandler {

    static async musicChannel(client: DiscordClient, message: Message) {
        const data = await getModel("IMusic", { guildId: message.guild!.id }) as IMusicInterface | void;
        if (!data) return;

        const channelId = data.channelId;
        if (!channelId || channelId.length < 5) return;
        if (channelId != message.channel.id) return;

        if (message.author.id === client.user?.id) {
            await delay(5000);
            if (!message.deleted) {
                message.delete().catch(err => Logger.log("ERROR", err));
            }
        } else {
            if (!message.deleted) {
                message.delete().catch(err => Logger.log("ERROR", err));
            }
        }

        const userChannel = message.member?.voice.channel;
        if (!userChannel) {
            message.reply({ embeds: [{
                color: "RED",
                title: "❌ Error | Voice Channel",
                description: "You're not join in voice channel, make sure you join to voice channel first to use this feature."
            }]}).then(m => setTimeout(() => m.delete(), 2e3));
            return;
        }

        let player = client.manager.players.get(message.guildId as string);

        if (player && userChannel?.id !== player.voiceChannel) 
            message.reply({ embeds: [{
                color: "RED",
                title: "❌ Error | Voice Channel",
                description: `You must join the same voice channel as me before request a message at ${userChannel}`
            }]}).then(m => setTimeout(() => m.delete(), 2e3));
            
        else {
            const args = message.content.trim().split(/ +/) as string[];
            const songName = args.join(" ");

            if (songName.startsWith("https://open.spotify.com/playlist/")) {
                message.channel.send({ embeds: [new MessageEmbed().setAuthor(`Spotify`, "https://i.imgur.com/cK7XIkw.png").setColor("AQUA").setTimestamp().setDescription(`Playlist is loding please wait...`)]}).then(msg => { setTimeout(() => {msg.delete()}, 3000);});
            } else if (songName.startsWith("https://open.spotify.com/album/")) {
                message.channel.send({ embeds: [new MessageEmbed().setAuthor(`Spotify`, "https://i.imgur.com/cK7XIkw.png").setColor("AQUA").setTimestamp().setDescription(`Album is loding please wait...`)]}).then(msg => { setTimeout(() => {msg.delete()}, 3000);});
            } else if (songName.startsWith("https://open.spotify.com/track/")) {
                message.channel.send({ embeds: [new MessageEmbed().setAuthor(`Spotify`, "https://i.imgur.com/cK7XIkw.png").setColor("AQUA").setTimestamp().setDescription(`Track is loding please wait...`)]}).then(msg => { setTimeout(() => {msg.delete()}, 3000);});
            }

            player = client.manager?.create({
                guild: message.guildId as string,
                textChannel: message.channelId  as string,
                voiceChannel: message.member?.voice.channelId as string,
                volume: 50 as number,
                selfDeafen: true as boolean
            });
            
            if (player?.state !== "CONNECTED") player?.connect();
            player.set("currentText", true)
            try {
                if (songName.match(client.lavasfy?.spotifyPattern as RegExp)) {
                    await client.lavasfy?.requestToken();
                    const node = client.lavasfy?.nodes.get("KiaraLavalink")
                    const search = await node?.load(songName)
                    if (search?.loadType === "PLAYLIST_LOADED") {
                        let songs = [];
                        for (let i = 0; i < search.tracks.length; i++) 
                        songs.push(TrackUtils.build(search.tracks[i] as LavalinkTrack, message.author));
                        player?.queue.add(songs);
                        if (!player?.playing && !player?.paused && player?.queue.totalSize === search.tracks.length)
                        player.play();
                        const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTimestamp()
                        .setDescription(`**Added Playlist to queue** [${search.playlistInfo.name}](${songName}) - [\`${search.tracks.length}\`]`);
                        message.channel.send({ embeds: [embed] });
                        return;
                    } else if (search?.loadType.startsWith("TRACK")) {
                        player?.queue.add(TrackUtils.build(search.tracks[0] as LavalinkTrack));
                        if (!player?.playing && !player?.paused && !player?.queue.size)
                        player?.play();
                        const embed = new MessageEmbed()
                        .setColor("RED")
                        .setTimestamp()
                        .setDescription(`**Added to queue** - [${search.tracks[0].info.title}](${search.tracks[0].info.uri})`)
                        message.channel.send({ embeds: [embed] });
                        return;
                    } else {
                        message.channel.send({ embeds: [new MessageEmbed().setColor('RED').setTimestamp().setDescription('there were no results found.')]});
                        return;
                    }
                } else {
                    let res;
                    try {
                        res = await player?.search(songName, message.author)
                        if (res?.loadType === "LOAD_FAILED") {
                            throw res.exception;
                        }
                    } catch (e: any) {
                        Logger.log('ERROR', e);
                        message.reply(`Error while searching: ${e.message as string}`);
                    }
            
                    switch (res?.loadType) {
                        case "NO_MATCHES": {
                            if (!player?.queue.current) {
                                player?.destroy();
                            }
                            const m = await message.reply(`There no found for: ${songName as string}`);
                            setTimeout(() => {
                                message.delete() 
                                m.delete()
                            }, 5e3)
                            return;
                        }
                        case "TRACK_LOADED": {
                            const track = res.tracks[0];
                            player?.queue.add(track);
                            if (!player?.playing && !player?.paused && !player?.queue.length) player?.play();
                                const embed = new MessageEmbed()
                                .setColor('RED')
                                .setTimestamp()
                                .setThumbnail(track.displayThumbnail("hqdefault"))
                                .setDescription(`**Added Songs to queue**\n[${track.title}](${track.uri}) - \`${convertTime(track.duration)}\``);
                                const m = await message.channel.send({ embeds: [embed] });
                                setTimeout(() => {
                                    m.delete()
                                }, 5e3)
                                return;
                        }
                        case "PLAYLIST_LOADED": {
                            player?.queue.add(res.tracks);
                            if (!player?.playing && !player?.paused && player?.queue.totalSize === res.tracks.length) player.play();
                            const embed = new MessageEmbed()
                            .setColor('RED')
                            .setTimestamp()
                            .setDescription(`**Added Playlist to queue**\n${res.tracks.length} Songs **${res.playlist?.name}** - \`[${convertTime(res.playlist?.duration as number)}]\``);
                            const m = await message.channel.send({ embeds: [embed] });
                            setTimeout(() => {
                                m.delete()
                            }, 5e3)
                            return;
                        }
                        case "SEARCH_RESULT": {
                            const track = res.tracks[0];
                            player?.queue.add(track);
                            if (!player?.playing && !player?.paused && !player?.queue.length) player?.play();
                                const embed = new MessageEmbed()
                                .setColor('RED')
                                .setTimestamp()
                                .setThumbnail(track.displayThumbnail("hqdefault"))
                                .setDescription(`**Added Songs to queue**\n[${track.title}](${track.uri}) - \`${convertTime(track.duration)}\``);
                                const m = await message.channel.send({ embeds: [embed] });
                                setTimeout(() => {
                                    m.delete()
                                }, 5e3)
                                return;
                        }
                    }
                }
            } catch (err: any) {
                Logger.log("ERROR", err.stack);
            }
        }
    }

    static async musicText(interaction: Interaction, client: DiscordClient) {
        if (!interaction.isButton()) return;
        let { guild, message, channel, member, user }: any = interaction;
        if (!guild) guild = client.guilds.cache.get(interaction.guildId as string);
        if (!guild) return;

        const data = await getModel("IMusic", { guildId: interaction.guild!.id }) as IMusicInterface | void;
        if (!data) return;

        const channelId = data.channelId;
        const messageId = data.musicId;

        if (!channelId || channelId.length < 5) return;
        if (!messageId || messageId.length < 5) return;

        if (!channel) channel = guild.channels.cache.get(interaction.channelId);
        if (!channel) return;

        if (channelId !== channel.id) return;
        if (messageId !== message.id) return;

        if (!member) member = guild.members.cache.get(user.id);
        if (!member) member = await guild.members.fetch(user.id).catch((err: any) => Logger.log("ERROR", err));
        if (!member) return;

        if (!member.voice.channel) {
            interaction.reply({
                embeds: [{
                    color: "RED",
                    title: "❌ Error | Voice Channel",
                    description: "You're not join in voice channel, make sure you join to voice channel first to use this feature."
                }],
                ephemeral: true
            });
            setTimeout(() => interaction.deleteReply(), 2e3);
            return;
        }

        const player = client.manager.players.get(interaction.guildId as string);

        if (player && member.voice.channel.id !== player.voiceChannel) {
            interaction.reply({
                embeds: [{
                    color: "RED",
                    title: "❌ Error | Voice Channel",
                    description: `You must join the same voice channel as me before request a message at <#${player.voiceChannel}>`
                }],
                ephemeral: true
            });
            setTimeout(() => interaction.deleteReply(), 2e3);
            return;
        }

        if (interaction.isButton()) {
            if (!player || !player.queue || !player.queue.current) {
                interaction.reply({
                    embeds: [{
                        color: "RED",
                        title: "❌ Error | Player Manager",
                        description: `There is no queue or music playing here.`
                    }],
                    ephemeral: true
                });
                return;
            }

            const Button = interaction  as ButtonInteraction;

            switch (Button.customId) {
                case `${client.user?.id}-btn-ch-skip`: {
                    player?.stop();
                    interaction.reply({
                        embeds: [{
                            color: "GREEN",
                            title: `✅ Sucess | Skipped Songs`,
                            description: `Songs has been skipped by ${interaction.member?.user}`
                        }]
                    });
                    setTimeout(() => interaction.deleteReply(), 2e3);
                    const data = generateEmbed(client, guild.id);
                    message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                }
                break;
                case `${client.user?.id}-btn-ch-stop`: {
                    interaction.reply({
                        embeds: [{
                            color: "GREEN",
                            title: `✅ Sucess | Stopped Songs`,
                            description: `Songs has been stopped by ${interaction.member?.user}, Leaving voice channel...`
                        }]
                    });
                    setTimeout(() => interaction.deleteReply(), 2e3);

                    if (player) {
                        await player.destroy();
                        const data = generateEmbed(client, guild.id, true);
                        message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                    } else {
                        const data = generateEmbed(client, guild.id, true);
                        message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                    }
                }
                break;
                case `${client.user?.id}-btn-ch-pauses`: {
                    if (!player?.playing) {
                        player?.pause(!player.paused);
                        interaction.reply({
                            embeds: [{
                                color: "GREEN",
                                title: `✅ Sucess | Resumed Song`,
                                description: `Songs has been resumed by ${interaction.member?.user}`
                            }]
                        });
                        setTimeout(() => interaction.deleteReply(), 2e3);
                    } else {
                        player?.pause(!player.paused);
                        interaction.reply({
                            embeds: [{
                                color: "GREEN",
                                title: `✅ Sucess | Paused Song`,
                                description: `Songs has been paused by ${interaction.member?.user}`
                            }]
                        });
                        setTimeout(() => interaction.deleteReply(), 2e3);
                    }
                    const data = generateEmbed(client, guild.id);
                    message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                }
                break;
                case `${client.user?.id}-btn-ch-shuffle`: {
                    player?.queue.shuffle();
                    interaction.reply({
                        embeds: [{
                            color: "GREEN",
                            title: `✅ Sucess | Shuffle Songs`,
                            description: `Songs has been shuffle by ${interaction.member?.user}`
                        }]
                    });
                    setTimeout(() => interaction.deleteReply(), 2e3);
                    const data = generateEmbed(client, guild.id);
                    message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                }
                break;
                case `${client.user?.id}-btn-ch-repeats`: {
                    if (player?.queueRepeat) {
                        player.setQueueRepeat(false);
                    }

                    player?.setTrackRepeat(!player.trackRepeat);
                    const dis = player.trackRepeat ? "Enable" : "Disable"
                    interaction.reply({
                        embeds: [{
                            color: "GREEN",
                            title: `✅ Sucess | Repeat Songs`,
                            description: `Repeat songs has been \`${dis}\` by ${interaction.member?.user}`
                        }]
                    });
                    setTimeout(() => interaction.deleteReply(), 2e3);
                    const data = generateEmbed(client, guild.id);
                    message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                }
                break;
                case `${client.user?.id}-btn-ch-repeatq`: {
                    if (player?.trackRepeat) {
                        player.setTrackRepeat(false);
                    }

                    player?.setQueueRepeat(!player.queueRepeat);
                    const dis = player.queueRepeat ? "Disable" : "Enable"
                    interaction.reply({
                        embeds: [{
                            color: "GREEN",
                            title: `✅ Sucess | Repeat Queue`,
                            description: `Repeat queue has been \`${dis}\` by ${interaction.member?.user}`
                        }]
                    });
                    setTimeout(() => interaction.deleteReply(), 2e3);
                    const data = generateEmbed(client, guild.id);
                    message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                }
                break;
                case `${client.user?.id}-btn-ch-forward`: {
                    const playerDuration = player?.queue.current?.duration as number
                    let seektime: number = player?.position as number + 10 * 1000;
                    if (10 <= 0) seektime = player?.position as number
                    if (seektime >= playerDuration) seektime = player?.queue.current?.duration as number - 1000;

                    await player?.seek(seektime);
                    interaction.reply({
                        embeds: [{
                            color: "GREEN",
                            title: `✅ Sucess | Forwaded Songs`,
                            description: `Songs has been forwaded by ${interaction.member?.user} for \`10 seconds\``
                        }]
                    });
                    setTimeout(() => interaction.deleteReply(), 2e3);
                    const data = generateEmbed(client, guild.id);
                    message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                }
                break;
                case `${client.user?.id}-btn-ch-rewind`: {
                    const playerPosition = player?.position as number;
                    const playerDuration = player?.queue.current?.duration as number
                    let seektime: number = playerPosition - 10 * 1000;
                    if (seektime >= playerDuration - playerPosition || seektime < 0) {
                        seektime = 0
                    }

                    await player?.seek(seektime);
                    interaction.reply({
                        embeds: [{
                            color: "GREEN",
                            title: `✅ Sucess | Rewinded Songs`,
                            description: `Songs has been rewinded by ${interaction.member?.user} for \`10 seconds\``
                        }]
                    });
                    setTimeout(() => interaction.deleteReply(), 2e3);
                    const data = generateEmbed(client, guild.id);
                    message.edit(data).catch((err: any) => Logger.log("ERROR", err));
                }
            }
        }
    }

    static async textMusic(interaction: Interaction, client: DiscordClient) {
            const player = client.manager?.players.get(interaction.guildId as string);

            if (interaction.isButton()) {
            const Button = interaction  as ButtonInteraction;
            switch (Button.customId) {
                case `${client.user?.id}-btn-leave`: {
                    if (!player) {
                        interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                    }
                    player?.destroy();
                    await interaction.deferReply();
                    interaction.deleteReply();
                }
                break;
                case `${client.user?.id}-btn-next`: {
                    if (!player) {
                        interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                    }
                    player?.stop();
                    await interaction.deferReply();
                    interaction.deleteReply();
                }
                break;
                case `${client.user?.id}-btn-pause`: {
                    if (!player) {
                        interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                    }
                    player?.pause(!player.paused);
                    await interaction.deferReply();
                    interaction.deleteReply();
                }
                break;
                case `${client.user?.id}-btn-repeat`: {
                    if (!player) {
                        interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                    }
                    player?.setQueueRepeat(!player.queueRepeat);
                    await interaction.deferReply();
                    interaction.deleteReply();
                }
                break;
                case `${client.user?.id}-btn-controls`: {
                    if (!player) {
                        interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                    }
                    player?.setTrackRepeat(!player.trackRepeat);
                    await interaction.deferReply();
                    interaction.deleteReply();
                }
                break;
                case `${client.user?.id}-btn-queue`: {
                    if (!player) {
                        interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                    }
                    await queue(interaction, client);
                    await interaction.deferReply();
                    interaction.deleteReply();
                }
                break;
                case `${client.user?.id}-btn-mix`: {
                    if (!player) {
                        interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                    }
                    player?.queue.shuffle();
                    await interaction.deferReply();
                    interaction.deleteReply();
                }
            }
        }

        if (interaction.isSelectMenu()) {
            const select = interaction as SelectMenuInteraction;
            if (select.values[0]) {
                console.log(select.values)
                if (select.values[0].toLocaleLowerCase().startsWith("pa")) player?.setEQ(...party);
                if (select.values[0].toLocaleLowerCase().startsWith("b")) player?.setEQ(...bass);
                if (select.values[0].toLocaleLowerCase().startsWith("r")) player?.setEQ(...radio);
                if (select.values[0].toLocaleLowerCase().startsWith("po")) player?.setEQ(...pop);
                if (select.values[0].toLocaleLowerCase().startsWith("t")) player?.setEQ(...trablebass);
                if (select.values[0].toLocaleLowerCase().startsWith("s")) player?.setEQ(...soft);
                if (select.values[0].toLocaleLowerCase().startsWith("o")) player?.clearEQ();
            }
            select.reply({
                embeds: [{
                    color: "GREEN",
                    author: { name: `✅ Success | Filter`},
                    description: `Music filter has set to\`${select.values[0] ? select.values[0] : "Off"}\``
                }]
            });

            setTimeout(() => {
                select.deleteReply();
            }, 3e3);
        }
    }
}