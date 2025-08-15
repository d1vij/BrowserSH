import type { Tokens } from "../../core/__typing";
import { AbstractCommand } from "../AbstractCommand";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { LoaderFactory } from "../../../ui/loader";
import { Colors } from "../../../output-handler/typing/enums";


export class __tmp extends AbstractCommand{
    public name = "clear";
    public flags: string[] = []
    public options: string[] = []

    protected __execute(_: Tokens): void{
        const l = new LoaderFactory(100,"Fetching from url", "braille",Colors.red);
        l.startLoading()
        setTimeout(()=>{
            l.stopLoading(true);
            TerminalOutputHandler.printToTerminal("Loadding stopped");
            l.setText("Doing something")
            l.setColor(Colors.green_mint);
            l.startLoading();
            setTimeout(()=>{
                l.stopLoading(true);
                TerminalOutputHandler.printToTerminal("Did something");
            },1000)
        }, 3000);
        
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