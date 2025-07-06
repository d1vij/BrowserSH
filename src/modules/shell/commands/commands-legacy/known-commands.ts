import type {ICommand } from "./Command";
import { Echo } from "./primary/echo";
import { Clear } from "./primary/clear";
import { NullCommand } from "./primary/null";
// import { Redirect } from "./primary/redirect";
import { Help } from "./primary/help";

export const KnownCommands: Record<string, ICommand | undefined> = {
    clear: Clear,
    echo: Echo,
    help: Help,
    null: NullCommand,
    // redirect: Redirect
}