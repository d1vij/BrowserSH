import type { Tokens } from "../../core/__typing";
import { AbstractCommand } from "../AbstractCommand";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { UserInputHandler } from "../../../output-handler/user-input-handler";
import { getCommandContext } from "../../core/extract";


export class __tmp extends AbstractCommand{
    public name = "clear";
    public flags: string[] = []
    public options: string[] = []

    protected __execute(toks: Tokens): void{
        const results = getCommandContext(toks);
        let output = ''
        
        if(results.flags.includes('a')) output += 'got a\n';
        if(results.flags.includes('b')) output += 'got b\n';
        output+= `c ${results.options['c']}\n`;
        output+= `dd ${results.options['dd']}`;

        TerminalOutputHandler.printToTerminal(output);
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