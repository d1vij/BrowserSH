import { AbstractCommand } from "./AbstractCommand";

import { Dummy } from "./commands/dummy";
import { Echo } from "./commands/echo";
import { Help } from "./commands/help";
import { Clear } from "./commands/clear";
import { MathCommand } from "./commands/math";

type CommandConstructor = new() => AbstractCommand;
const commandIndex = new Map<string, CommandConstructor>([
    ["echo", Echo],
    ["help", Help],
    ["clear", Clear],
    ["math", MathCommand],
    ["dummy", Dummy],
] as [string, CommandConstructor][]);

export function getCommandConstructor(name: string) {
    return commandIndex.get(name);
}