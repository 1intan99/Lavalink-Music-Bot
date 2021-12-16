import dotenv from "dotenv";
import EnvError from "../errors/EvnError";

export default class EnvLoader {
    static load() {
        dotenv.config();
        this.validate(process.env);
    }

    private static validate(env: any) {
        if (env.TOKEN === "") throw new EnvError("Missing Discord Client Token!");
        if (env.PREFIX === "") throw new EnvError("Missing DIscord Client Prefix!");
        if (env.DSN === "") throw new EnvError("Missing Sentry DSN!");
        if (!env.DEVELOPERS.startsWith("[") || !env.DEVELOPERS.endsWith("]")) throw new EnvError("Missing Developers Id, Developers must be an array.");

        try {
            JSON.parse(env.DEVELOPERS);
        } catch (_) {
            throw new EnvError("Developers must be an array.");
        }
    }
}
