import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js";

export default class Filter extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: 'filter',
            aliases: ['eq', 'equalizer'],
            description: 'Set Music Equalizer\nAvailable Filter: (party, bass, radio, pop, trablebass, soft, custom, off)',
            group: 'Music',
            examples: ['filter bass<Filter Name>'],
            cooldown: 3
        })
    }
    async exec(message: Message, args: string[]) {
        if (!message.member?.voice.channel) {
            message.channel.send(`You're not in voice channel!`);
        };
        
        const player = this.client.manager?.players.get(message.guildId as string);
        if (!player) return message.channel.send(`There is no music playing at this server!`);

        const thing = new MessageEmbed()
        .setColor(`GREEN`)
        .setTimestamp()

        if (args[0] == 'party') {
            var bands = [
                { band: 0, gain: -1.16 },
                { band: 1, gain: 0.28 },
                { band: 2, gain: 0.42 },
                { band: 3, gain: 0.5 },
                { band: 4, gain: 0.36 },
                { band: 5, gain: 0 },
                { band: 6, gain: -0.3 },
                { band: 7, gain: -0.21 },
                { band: 8, gain: -0.21 } 
            ];
            thing.setDescription(`Party mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'bass') {
            var bands = [
                { band: 0, gain: 0.6 },
                { band: 1, gain: 0.7 },
                { band: 2, gain: 0.8 },
                { band: 3, gain: 0.55 },
                { band: 4, gain: 0.25 },
                { band: 5, gain: 0 },
                { band: 6, gain: -0.25 },
                { band: 7, gain: -0.45 },
                { band: 8, gain: -0.55 },
                { band: 9, gain: -0.7 },    
                { band: 10, gain: -0.3 },    
                { band: 11, gain: -0.25 },
                { band: 12, gain: 0 },   
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }    
            ];
            thing.setDescription(`Bass mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'radio') {
            var bands = [
                { band: 0, gain: 0.65 },
                { band: 1, gain: 0.45 },
                { band: 2, gain: -0.45 },
                { band: 3, gain: -0.65 },
                { band: 4, gain: -0.35 },
                { band: 5, gain: 0.45 },
                { band: 6, gain: 0.55 },
                { band: 7, gain: 0.6 },
                { band: 8, gain: 0.6 },
                { band: 9, gain: 0.6 },    
                { band: 10, gain: 0 },    
                { band: 11, gain: 0 },
                { band: 12, gain: 0 },   
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }  
            ];
            thing.setDescription(`Radio mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'pop') {
            var bands = [
                { band: 0, gain: -0.25 },
                { band: 1, gain: 0.48 },
                { band: 2, gain: 0.59 },
                { band: 3, gain: 0.72 },
                { band: 4, gain: 0.56 },
                { band: 5, gain: 0.15 },
                { band: 6, gain: -0.24 },
                { band: 7, gain: -0.24 },
                { band: 8, gain: -0.16 },
                { band: 9, gain: -0.16 },    
                { band: 10, gain: 0 },    
                { band: 11, gain: 0 },
                { band: 12, gain: 0 },   
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }
            ];
            thing.setDescription(`Pop mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'trablebass') {
            var bands = [
                { band: 0, gain: 0.6 },
                { band: 1, gain: 0.67 },
                { band: 2, gain: 0.67 },
                { band: 3, gain: 0 },
                { band: 4, gain: -0.5 },
                { band: 5, gain: 0.15 },
                { band: 6, gain: -0.45 },
                { band: 7, gain: 0.23 },
                { band: 8, gain: 0.35 },
                { band: 9, gain: 0.45 },
                { band: 10, gain: 0.55 },
                { band: 11, gain: 0.6 },
                { band: 12, gain: 0.55 },
                { band: 13, gain: 0 },
                { band: 14, gain: 0 }
            ];
            thing.setDescription(`Trablebass mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] === "Bassboost" || args[0] == 'bassboost') {
            var bands = new Array(7).fill(null).map((_, i) => (
                { band: i, gain: 0.25 }
            ));
            thing.setDescription(`Bassboost mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'soft') {
            var bands =  [
                { band: 0, gain: 0 },
                { band: 1, gain: 0 },
                { band: 2, gain: 0 },
                { band: 3, gain: 0 },
                { band: 4, gain: 0 },
                { band: 5, gain: 0 },
                { band: 6, gain: 0 },
                { band: 7, gain: 0 },
                { band: 8, gain: -0.25 },
                { band: 9, gain: -0.25 },    
                { band: 10, gain: -0.25 },    
                { band: 11, gain: -0.25 },
                { band: 12, gain: -0.25 },   
                { band: 13, gain: -0.25 },   
                { band: 14, gain: -0.25 } 
            ];
            thing.setDescription(`Soft mode is ON`);
            player.setEQ(...bands);
        } else if (args[0] == 'custom') {
            var band = [
                { band: 0, gain: args[1] },
                { band: 1, gain: args[2] },
                { band: 2, gain: args[3] },
                { band: 3, gain: args[4] },
                { band: 4, gain: args[5] },
                { band: 5, gain: args[6] },
                { band: 6, gain: args[7] },
                { band: 7, gain: args[8] },
                { band: 8, gain: args[9] },
                { band: 9, gain: args[10] },    
                { band: 10, gain: args[11] },    
                { band: 11, gain: args[12] },
                { band: 12, gain: args[13] },   
                { band: 13, gain: args[14] }    
            ] as any
            thing.setDescription(`Custom Equalizer mode is ON`);
            player.setEQ(...band);
        } else if (args[0] === "Off" || args[0] == 'off') {
            thing.setDescription(`Equalizer mode is OFF`);
            player.clearEQ();
        }
        return message.reply({embeds: [thing]});
    }
}