import Event from "../../structures/Event";
import DiscordClient from "../../structures/Client";
import { ButtonInteraction, Interaction } from "discord.js-light";
import SentryLoggers from "../../class/SentryLoggers";
import { queue } from "../../utils/lavalink-function";

export default class InteractionCreate extends Event {
    constructor(client: DiscordClient) {
        super(client, "interactionCreate");
    }

    async exec(interaction: Interaction) {
        try {
            if (interaction.isButton()) {
                const player = this.client.manager?.players.get(interaction.guildId);
                const Button = interaction  as ButtonInteraction;
                switch (Button.customId) {
                    case "btn-leave": {
                        if (!player) {
                            interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                        }
                        player?.destroy();
                        await interaction.deferReply();
                        interaction.deleteReply();
                    }
                    break;
                    case "btn-next": {
                        if (!player) {
                            interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                        }
                        player?.stop();
                        await interaction.deferReply();
                        interaction.deleteReply();
                    }
                    break;
                    case "btn-pause": {
                        if (!player) {
                            interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                        }
                        player?.pause(!player.paused);
                        await interaction.deferReply();
                        interaction.deleteReply();
                    }
                    break;
                    case "btn-repeat": {
                        if (!player) {
                            interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                        }
                        player?.setQueueRepeat(!player.queueRepeat);
                        await interaction.deferReply();
                        interaction.deleteReply();
                    }
                    break;
                    case "btn-controls": {
                        if (!player) {
                            interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                        }
                        player?.setTrackRepeat(!player.trackRepeat);
                        await interaction.deferReply();
                        interaction.deleteReply();
                    }
                    break;
                    case "btn-queue": {
                        if (!player) {
                            interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                        }
                        await queue(interaction, this.client);
                        await interaction.deferReply();
                        interaction.deleteReply();
                    }
                    break;
                    case "btn-mix": {
                        if (!player) {
                            interaction.reply({ ephemeral: true, content: "There is no music play in this server!"});
                        }
                        player?.queue.shuffle();
                        await interaction.deferReply();
                        interaction.deleteReply();
                    }
                }
            }
            
        } catch (err: any) {
            SentryLoggers.getInstance().BotLoggers(err);
            if (interaction.isApplicationCommand() || interaction.isMessageComponent() || interaction.isSelectMenu() || interaction.isContextMenu()) {
                return interaction[interaction.replied ? 'editReply' : 'reply'](`Something went back on executing this operation. Please, refer bot developers about errors.`);
            }
        }
    }
}