import type { Tokens } from "../../core/typing";
import { AbstractCommand } from "../AbstractCommand";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { SHELL } from "../../../main";


export class WhoAmI extends AbstractCommand {
    public name = "whoami";
    public flags: string[] = []
    public options: string[] = []

    protected __execute(_: Tokens): void {
        TerminalOutputHandler.printToTerminal(SHELL.globals.vars.get("&&username") || "UNKNOWN");
        return;
    }

    public info(): string[] {
        return [`clears terminal screen`];
    }

    public usage(): string[] {
        return [`usage: clear`];
    }
    protected handleErrors(err: any): void {
        TerminalOutputHandler.standardErrorOutput([
            `How even did this command raise an error ???`,
            err.name
        ])
    }
}