import { Schema, model, Model, Document } from "mongoose";

export interface IMusicInterface {
    guildId: string;
    channelId: string;
    musicId: string;
}

const IMusicSchema: Schema = new Schema({
    guildId: String,
    channelId: String,
    musicId: String
});

export const IMusic: Model<IMusicInterface> = model("IMusic", IMusicSchema);