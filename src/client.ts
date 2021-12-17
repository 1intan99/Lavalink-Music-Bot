import DiscordClient from "./structures/Client";

const client: DiscordClient = new DiscordClient(['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MEMBERS']);
export default client;