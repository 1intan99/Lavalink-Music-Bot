import Event from "../../structures/Event";
import DiscordClient from "../../structures/Client";
import { Permissions, VoiceChannel, VoiceState } from "discord.js-light";
import { leaveEmpt } from "../../utils/client-config";
import SentryLoggers from "../../class/SentryLoggers";
import Logger from "../../class/Logger";

export default class VoiceStateUpdate extends Event {
    constructor(client: DiscordClient) {
        super(client, "voiceStateUpdate");
    }

    async exec(oldChannel: VoiceState, newState: VoiceState) {
        if (newState.channelId && newState.channel?.type === "GUILD_STAGE_VOICE" && newState.guild.me?.voice.suppress) {
            const botPermissions = newState.guild.me.permissions.has(Permissions.FLAGS.SPEAK) ||(newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.SPEAK));
            if (botPermissions) {
                newState.channel.permissionOverwrites.edit(newState.guild.me, { SPEAK: true, MOVE_MEMBERS: true, MUTE_MEMBERS: true });
                await newState.guild.me?.voice.setSuppressed(false).catch((err) => Logger.log("ERROR", err));
            }
        }

        if (oldChannel.channelId && (!newState.channelId || newState.channelId)) {
            const player = this.client.manager.players.get(newState.guild.id);
            if (player && oldChannel.channelId === player.voiceChannel) {
                if (!((!oldChannel.streaming && newState.streaming) || (oldChannel.streaming && !newState.streaming) || (!oldChannel.serverMute && newState.serverMute && (!newState.serverDeaf && !newState.selfDeaf)) || (oldChannel.serverMute && !newState.serverMute && (!newState.serverDeaf && !newState.selfDeaf)) || (!oldChannel.selfMute && newState.selfMute && (!newState.serverDeaf && !newState.selfDeaf)) || (oldChannel.selfMute && !newState.selfMute && (!newState.serverDeaf && !newState.selfDeaf)) || (!oldChannel.selfVideo && newState.selfVideo) || (oldChannel.selfVideo && !newState.selfVideo))) {
                    if (leaveEmpt && player && (!oldChannel.channel?.members || oldChannel.channel.members.size == 0 || oldChannel.channel.members.filter((m) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf).size < 1)) {
                        setTimeout(async () => {
                            try {
                                let voice: any = newState.guild.channels.cache.get(player.voiceChannel as string);
                                if (voice) voice = await voice.fetch();
                                if (!voice) voice = await newState.guild.channels.fetch(player.voiceChannel as string).catch(() => {}) || false;
                                if (!voice) return player.destroy();
                                if (!voice.membes || voice.members.size === 0 || voice.members.filter((m: any) => !m.user.bot && !m.voice.deaf && !m.voice.selfDeaf).size < 1) {
                                    player.destroy();
                                    return;
                                }
                            } catch (err: any) {
                                SentryLoggers.getInstance().BotLoggers(err);
                                console.log(err);
                            }
                        }, 6e4)
                    }
                }
            }
        }
    }
}