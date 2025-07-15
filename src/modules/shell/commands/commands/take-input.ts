import { OutputTemplates } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { takeUserInput } from "../../../ui/user-input";
import type { Tokens } from "../../core/__typing";
import { AbstractCommand } from "../AbstractCommand";

export class TakeInput extends AbstractCommand {
    public name: string = "ls";
    public flags: string[] = [];
    public options: string[] = [];

    public async __execute(tokens: Tokens) {
        console.log("tking input")
        TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput("Hi how are you ???"));
        const result = await takeUserInput("name");
        TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(result || "GIVE NAME 🔫"));
        console.log(result);
    }
    public handleErrors(err: any): void {

    }
    public info(): Array<string> {

    }
    public usage(): Array<string> {
    }
}