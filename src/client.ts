import DiscordClient from "./structures/Client";

const client: DiscordClient = new DiscordClient(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_VOICE_STATES']);
export default client;