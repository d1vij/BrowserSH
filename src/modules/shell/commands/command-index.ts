import { AbstractCommand } from "./AbstractCommand";

import { Echo } from "./commands/echo";
import { Help } from "./commands/help";
import { Clear } from "./commands/clear";
import { MathCommand } from "./commands/math";
import { Cd } from "./commands/file-system/cd";
import { Ls } from "./commands/file-system/ls";
import { List } from "./commands/list";


type CommandConstructor = new() => AbstractCommand;

export const commandIndex = new Map<string, CommandConstructor>([
    ["cd", Cd],
    ["clear", Clear],
    ["echo", Echo],
    ["help", Help],
    ["math", MathCommand],
    ["ls", Ls],
    ["list", List]
] as [string, CommandConstructor][]);

export function getCommandConstructor(name: string) {
    return commandIndex.get(name);
}