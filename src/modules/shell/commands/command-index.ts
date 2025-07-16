import { AbstractCommand } from "./AbstractCommand";

import { Cd } from "./commands/file-system/cd";
import { Ls } from "./commands/file-system/ls";
import { Rm } from "./commands/file-system/rm";
import { Cat } from "./commands/file-system/cat";
import { List } from "./commands/list";
import { Echo } from "./commands/echo";
import { Help } from "./commands/help";
import { Clear } from "./commands/clear";
import { Mkdir } from "./commands/file-system/mkdir";
import { MathCommand } from "./commands/math";
import { Exit } from "./commands/exit";
import { Run } from "./commands/run/run";


type CommandConstructor = new() => AbstractCommand;

export const commandIndex = new Map<string, CommandConstructor>([
    ["cat", Cat],
    ["cd", Cd],
    ["clear", Clear],
    ["echo", Echo],
    ["help", Help],
    ["math", MathCommand],
    ["mkdir", Mkdir],
    ["ls", Ls],
    ["list", List],
    ["rm", Rm],
    ["run", Run],
    ['exit',Exit],
    
] as [string, CommandConstructor][]);

export function getCommandConstructor(name: string) {
    return commandIndex.get(name);
}