import type { Tokens } from "../../core/__typing";
import { AbstractCommand } from "../AbstractCommand";
import { addColor } from "../../../output-handler/formatter";
import { Colors } from "../../../output-handler/typing/enums";
import { terminalLinesList, terminalInputFeild } from "../../../../domElements";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";


export class Clear extends AbstractCommand{
    public name = "clear";
    public flags: string[] = []
    public options: string[] = []

    public execute(_: Tokens): void {
        try{

            terminalLinesList.innerHTML = "";
            terminalInputFeild.value = "";
            return;
        } catch(err) {
            this.handleErrors(err);
        }
    }
    public info(): string {
        return `${addColor("clear", Colors.blue_cool)}: clears terminal screen`;
    }

    public usage(): string {
        return `${addColor("clear", Colors.blue_cool)}`;
    }
    public handleErrors(err: any): void {
        TerminalOutputHandler.standardErrorOutput([
            `How even did this command raise an error ???`,
            err.name
        ])
    }
}