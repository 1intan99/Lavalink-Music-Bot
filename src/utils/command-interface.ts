import { PermissionString } from "discord.js-light";

export interface NaoCommandInterface {
    name: string;
    group: string;
    aliases?: string[];
    examples?: string[];
    description?: string;
    cooldown?: number;
    enabled?: boolean;
    onlyNsfw?: boolean;
    require?: NaoCommandRequire;
}

interface NaoCommandRequire {
    developers?: boolean;
    userPermissions?: PermissionString[];
    clientPermissions?: PermissionString[];
}
