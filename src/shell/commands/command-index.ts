import { AbstractCommand } from "./AbstractCommand";

import { Cd } from "./command-declarations/file-system/cd";
import { Ls } from "./command-declarations/file-system/ls";
import { Rm } from "./command-declarations/file-system/rm";
import { Cat } from "./command-declarations/file-system/cat";
import { List } from "./command-declarations/list";
import { Echo } from "./command-declarations/echo";
import { Help } from "./command-declarations/help";
import { Clear } from "./command-declarations/clear";
import { Mkdir } from "./command-declarations/file-system/mkdir";
import { MathCommand } from "./command-declarations/math";
import { Exit } from "./command-declarations/exit";
import { Notepad } from "./command-declarations/notepad";
import { __tmp } from "./command-declarations/__tmp";
import { Facts } from "./command-declarations/facts";
import { BirthdayGuesser } from "./command-declarations/birthday-guesser";
import { WhoAmI } from "./command-declarations/whoami";

type CommandConstructor = new () => AbstractCommand;

export const commandIndex = new Map<string, CommandConstructor>([
    ["__tmp", __tmp],
    ["birthday-guesser", BirthdayGuesser],
    ["cat", Cat],
    ["cd", Cd],
    ["clear", Clear],
    ["echo", Echo],
    ['exit', Exit],
    ["facts", Facts],
    ["help", Help],
    ["math", MathCommand],
    ["mkdir", Mkdir],
    ['notepad', Notepad],
    ["ls", Ls],
    ["list", List],
    ["rm", Rm],
    ["whoami", WhoAmI]

] as [string, CommandConstructor][]);

export function getCommandConstructor(name: string) {
    return commandIndex.get(name);
}