import Event from "../../structures/Event";
import DiscordClient from "../../structures/Client";
import { ButtonInteraction, Interaction } from "discord.js-light";
import SentryLoggers from "../../class/SentryLoggers";
import { queue } from "../../utils/lavalink-function";
import MusicHandler from "../../class/MusicHandler";

export default class InteractionCreate extends Event {
    constructor(client: DiscordClient) {
        super(client, "interactionCreate");
    }

    async exec(interaction: Interaction) {
        try {
            await MusicHandler.textMusic(interaction, this.client);
            await MusicHandler.musicText(interaction, this.client);
        } catch (err: any) {
            SentryLoggers.getInstance().BotLoggers(err);
            if (interaction.isApplicationCommand() || interaction.isMessageComponent() || interaction.isSelectMenu() || interaction.isContextMenu()) {
                return interaction[interaction.replied ? 'editReply' : 'reply'](`Something went back on executing this operation. Please, refer bot developers about errors.`);
            }
        }
    }
}