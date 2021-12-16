import { init, captureException, close } from "@sentry/node";
import DsnError from "../errors/Dsn";

export default class SentryLoggers {
    private static instance: SentryLoggers;
    private constructor(dsn: string) {
        init({ dsn, sampleRate: 0.75, environment: process.env.NODE_ENV === "development" ? "development" : "production", autoSessionTracking: true });
    }

    public static getInstance(): SentryLoggers {
        if (!SentryLoggers.instance as any) {
            const dsn = process.env.DSN;

            if (!dsn) {
                throw new DsnError("Failed to intialize DSN");
            }
            SentryLoggers.instance = new SentryLoggers(dsn);
        }
        return SentryLoggers.instance;
    }

    private caputureErrors(err: Error): void {
        if (process.env.NODE_ENV === "development") {
            console.log(err);
        }

        captureException(err);
    }

    public BotLoggers(err: Error): void {
        err.message = `[ Nao Errors ]: ${err.message}`;

        this.caputureErrors(err);
    }

    public async closeLoggers(): Promise<void> {
        await close();
    }
}
