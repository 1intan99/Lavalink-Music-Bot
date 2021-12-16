export interface IManagerEvents {
    /** Events name of Erela.Js */
    name: "nodeConnect" | "nodeCreate" | "nodeDestroy" | "nodeReconnect" | "nodeDisconnect" | "nodeError" | "nodeRaw" | "playerCreate" | "playerDestroy" | "queueEnd" | "playerMove" | "trackStart" | "trackEnd" | "trackStuck" | "trackError" | "socketClosed";
}

export interface ICache {
    /** MessageEmbed channel id */
    channelId?: string;

    /** MessageEmbed Id */
    musicMessageId?: string;
}