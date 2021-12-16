import DiscordClient from "./structures/Client";

const client: DiscordClient = new DiscordClient(["GUILD_VOICE_STATES", "GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"]);
export default client;