import type { Tokens } from "../../core/__typing";
import { AbstractCommand } from "../AbstractCommand";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { UserInputHandler } from "../../../output-handler/user-input-handler";


export class Clear extends AbstractCommand{
    public name = "clear";
    public flags: string[] = []
    public options: string[] = []

    protected __execute(_: Tokens): void{

        TerminalOutputHandler.clearTerminal();
        UserInputHandler.clearUserInput();
        return;
    }

    public info(): string[] {
        return [`clears terminal screen`];
    }

    public usage(): string[] {
        return [`usage: clear`];
    }
    public handleErrors(err: any): void {
        TerminalOutputHandler.standardErrorOutput([
            `How even did this command raise an error ???`,
            err.name
        ])
    }
}