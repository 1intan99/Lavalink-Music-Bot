import { Collection } from "discord.js";
import path from "path";
import requireAll from "require-all";
import RegisterError from "../errors/RegisterError";
import Command from "../structures/Command";
import Event from "../structures/Event";
import DiscordClient from "../structures/Client";
import { isConstructor } from "../utils/client-functions";
import Logger from "./Logger";
import Lava from "../structures/Lava";

export default class Register {
    private readonly client: DiscordClient;
    private commands: Collection<string, Command>;
    private readonly commandPaths: string[] = [];
    private events: Collection<string, Event>;
    private readonly eventsPath: string[] = [];
    private cooldowns: Collection<string, Collection<string, number>>;
    private groups: Collection<string, string[]>;
    private lava: Collection<string, Lava>;
    private readonly lavaPaths: string[] = [];

    constructor(client: DiscordClient) {
        this.client = client;
        this.events = new Collection<string, Event>();
        this.cooldowns = new Collection<string, Collection<string, number>>();
        this.groups = new Collection<string, string[]>();
        this.commands = new Collection<string, Command>();
        this.lava = new Collection<string, Lava>();
    }

    private registerEvent(event: Event) {
        if (this.events.some((e: any) => e.name === event.name)) throw new RegisterError(`A event with the name "${event.name}" is already registered.`);

        this.events.set(event.name, event);
        this.client.on(event.name, event.exec.bind(event));
        Logger.log("INFO", `Event "${event.name}" loaded.`);
    }

    private registerLava(lava: Lava) {
        if (this.lava.some((e: any) => e.info.name === lava.info.name)) throw new RegisterError(`A LavaEvent with the name "${lava.info.name}" is already registered`);

        this.lava.set(lava.info.name, lava);
        this.client.manager?.on(lava.info.name as any, lava.run.bind(lava));
        Logger.log("INFO", `Lava "${lava.info.name}" loaded.`);
    }

    public registerAllLava() {
        const lava: any[] = [];

        if (this.lavaPaths.length) this.lavaPaths.forEach(p => {
            delete require.cache[p];
        });

        requireAll({
            dirname: path.join(__dirname, '..', 'lava'),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => lava.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith('.ts') || filePath.endsWith('.js')) this.lavaPaths.push(path.resolve(filePath));
                return name
            }
        });

        for (let event of lava) {
            const valid = isConstructor(event, Lava) || isConstructor(event.default, Lava) || event instanceof Lava || event.default instanceof Lava;
            if (!valid) continue;

            if (isConstructor(event, Lava)) event = new event(this.client);
            else if (isConstructor(event.default, Lava)) event = new event.default(this.client);
            if (!(event instanceof Lava)) throw new RegisterError(`Invalid Lava object to register: ${event}`);

            this.registerLava(event);
        }
    }

    private registerAllEvents() {
        const events: any[] = [];

        if (this.eventsPath.length) {
            this.eventsPath.forEach(p => {
                delete require.cache[p];
            });
        }

        requireAll({
            dirname: path.join(__dirname, "..", "events"),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => events.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith(".ts") || filePath.endsWith(".js")) this.eventsPath.push(path.resolve(filePath));
                return name;
            }
        });

        for (let event of events) {
            const valid = isConstructor(event, Event) || isConstructor(event.default, Event) || event instanceof Event || event.default instanceof Event;
            if (!valid) continue;

            if (isConstructor(event, Event)) event = new event(this.client);
            else if (isConstructor(event.default, Event)) event = new event.default(this.client);
            if (!(event instanceof Event)) throw new RegisterError(`Invalid event object to register: ${event}`);

            this.registerEvent(event);
        }
    }

    private registerCommand(command: Command) {
        if (
            this.commands.some((x: any) => {
                if (x.info.name === command.info.name) return true;
                else if (x.info.aliases && x.info.aliases.includes(command.info.name)) return true;
                return false;
            })
        ) { throw new RegisterError(`A command with the name/alias "${command.info.name}" is already registered.`); }

        if (command.info.aliases) {
            for (const alias of command.info.aliases) {
                if (
                    this.commands.some((x: any) => {
                        if (x.info.name === alias) return true;
                        else if (x.info.aliases && x.info.aliases.includes(alias)) return true;
                        return false;
                    })
                ) { throw new RegisterError(`A command with the name/alias "${alias}" is already registered.`); }
            }
        }

        this.commands.set(command.info.name, command);
        if (!this.groups.has(command.info.group)) { this.groups.set(command.info.group, [command.info.name]); } else {
            const groups = this.groups.get(command.info.group) as string[];
            groups.push(command.info.name);
            this.groups.set(command.info.group, groups);
        }
        Logger.log("INFO", `Command "${command.info.name}" loaded.`);
    }

    private registerAllCommands() {
        const commands: any[] = [];

        if (this.commandPaths.length) {
            this.commandPaths.forEach(p => {
                delete require.cache[p];
            });
        }

        requireAll({
            dirname: path.join(__dirname, "..", "commands"),
            recursive: true,
            filter: /\w*.[tj]s/g,
            resolve: x => commands.push(x),
            map: (name, filePath) => {
                if (filePath.endsWith(".ts") || filePath.endsWith(".js")) this.commandPaths.push(path.resolve(filePath));
                return name;
            }
        });

        for (let command of commands) {
            const valid = isConstructor(command, Command) || isConstructor(command.default, Command) || command instanceof Command || command.default instanceof Command;
            if (!valid) continue;

            if (isConstructor(command, Command)) command = new command(this.client);
            else if (isConstructor(command.default, Command)) command = new command.default(this.client);
            if (!(command instanceof Command)) throw new RegisterError(`Invalid command object to register: ${command}`);

            this.registerCommand(command);
        }
    }

    findCommand(command: string): Command | undefined {
        return this.commands.get(command) || [...this.commands.values()].find(cmd => cmd.info.aliases && cmd.info.aliases.includes(command));
    }

    findCommandsInGroup(group: string): string[] | undefined {
        return this.groups.get(group);
    }

    getAllGroupNames() {
        return [...this.groups.keys()];
    }

    getCooldownTimestamps(commandName: string): Collection<string, number> {
        if (!this.cooldowns.has(commandName)) this.cooldowns.set(commandName, new Collection<string, number>());
        return this.cooldowns.get(commandName) as Collection<string, number>;
    }

    pregisterAll() {
        this.registerAllCommands();
        this.registerAllEvents();
        this.registerAllLava();
    }

    registerAll() {
        const allEvents = [...this.events.keys()];
        allEvents.forEach(event => this.client.removeAllListeners(event));
        this.events = new Collection<string, Event>();
        this.cooldowns = new Collection<string, Collection<string, number>>();
        this.groups = new Collection<string, string[]>();
        this.commands = new Collection<string, Command>();
        this.lava = new Collection<string, Lava>();
        this.pregisterAll();
    }
}
