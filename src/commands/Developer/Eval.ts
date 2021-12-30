import Command from "../../structures/Command";
import DiscordClient from "../../structures/Client";
import { Message, MessageEmbed } from "discord.js-light";
import { inspect } from "util";
import req from "snekfetch";

export default class EvalCommand extends Command {
    constructor(client: DiscordClient) {
        super(client, {
            name: "eval",
            aliases: ["e"],
            group: "Developer",
            require: { developers: true }
        });
    }

    async exec(message: Message, args: string[]) {
        const code = args.join(" ");
        const { flags } = this.parseQuery(code);
        const embed = new MessageEmbed()
            .setTitle(`${this.client.user?.tag}'s Evaled`)
            .setColor("RANDOM")
            .addField("Input", `\`\`\`js\n${code}\`\`\``)
            .setFooter(`Request for ${message.author.tag}`, message.author.avatarURL({ dynamic: true }) as string);

        try {
            if (args.length < 1) return;
            let parsed = args.join(" ");
            let depth: any = 0;
            if (flags.includes("async")) {
                parsed = `(async() => {${parsed}})`;
            }
            if (flags.some((x: any) => x.inclues("dept"))) {
                depth = flags.find((x: any) => x.includes("dept").split("=")[1]);
                depth = parseInt(depth, 10);
            }

            let { evaled, type } = await this.parseEval(eval(parsed));
            if (flags.includes("silent")) return;

            if (typeof evaled !== "string") { evaled = inspect(evaled, { depth }); }
            evaled = evaled
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@​/g, `@​${String.fromCharCode(8203)}`);
            evaled = evaled.replace(new RegExp(this.client.token!, "g"), "[REDACTED]");
            if (code.toLowerCase().includes("token")) return message.channel.send("トークンがありません");

            if (evaled.length > 1024) {
                const { body } = await req.post("http://tk-bin.glitch.me/documents").send(evaled) as any;
                embed.addField("Output", `http://tk-bin.glitch.me/${body.key}.js`);
                embed.addField("Type", typeof type);
            } else {
                embed.addField("Output", `\`\`\`js\n${evaled}\`\`\``);
                embed.addField("Type", typeof type);
            }
        } catch (e) {
            const error: any = (e);
            if (error.length > 1024) {
                const { body } = await req.post("http://tk-bin.glitch.me/documents").send(error) as any;
                embed.addField("Error", `http://tk-bin.glitch.me/${body.key}.js`);
            } else {
                embed.addField("Error", `\`\`\`js\n${error}\`\`\``);
            }
        }
        return message.channel.send({ embeds: [embed] });
    }

    async aw(code: string) {
        const evalu = await eval(code);
        return evalu;
    }

    private parseQuery(queries: string): any {
        const args = [];
        const flags = [];
        for (const query of queries.split(" ")) {
            if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
            else args.push(query);
        }
        return {
            args,
            flags
        };
    }

    private async parseEval(input: any): Promise<any> {
        const isPromise: boolean =
            input instanceof Promise &&
            typeof input.then === "function" &&
            typeof input.catch === "function";
        if (isPromise) {
            input = await input;
            return {
                evaled: input,
                type: `Promise<${this.parseType(input)}>`
            };
        }
        return {
            evaled: input,
            type: this.parseType(input)
        };
    }

    private parseType(input: any): string {
        if (input instanceof Buffer) {
            let length = Math.round(input.length / 1024 / 1024);
            let ic = "MB";
            if (!length) {
                length = Math.round(input.length / 1024);
                ic = "KB";
            }
            if (!length) {
                length = Math.round(input.length);
                ic = "Bytes";
            }
            return `Buffer (${length} ${ic})`;
        }
        return input === null || input === undefined
            ? "Void"
            : input.constructor.name;
    }
}
