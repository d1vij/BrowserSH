// TODO: print "You can checkout any time you like, but you can never leave!!" when user enters exit

import { addColor, OutputTemplates } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/typing/enums";
import type { Tokens } from "../../core/__typing";
import { AbstractCommand } from "../AbstractCommand";

export class Exit extends AbstractCommand {
    public name: string = "exit";
    public flags: string[] = [];
    public options: string[] = [];
    

    protected __execute(_: Tokens): void{
        TerminalOutputHandler.printToTerminal("You can check out any time you like, but you can never leave");
        return;
    }
    
    public handleErrors(_: any): void {}
    public info(): string[] {
        return [
            "Terminates the shell session and exits the CLI environment."
        ];
    }

    public usage(): string[] {
        return [
            addColor("usage: exit", Colors.blue_light),
            " ",
            "Example",
            "\t" + addColor("exit", Colors.blue_light) + " => exits the CLI"
        ];
    }
    
}