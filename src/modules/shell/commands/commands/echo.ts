import { addColor, OutputTemplates } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/typing/enums";
import type { Tokens } from "../../core/__typing";
import { extractFlagsAndOptions } from "../../core/extract";
import { InvalidColorError, InvalidFlagError, InvalidNumberError, InvalidOptionError } from "../__errors";
import { AbstractCommand } from "../AbstractCommand";
import { processGenericErrors } from "../processGenericErrors";


export class Echo extends AbstractCommand {
    public name = "echo";
    public flags: string[] = ['r','reverse'];
    public options: string[] = ['colors', 'l', 'loop'];

    public execute(tokens:Tokens): void {
        try{
            this.__execute(tokens);
        } catch(err:any){
            this.handleErrors(err);
        }
    }
    public info(): string[] {
        return [`display a line of text`];
    }
    public usage(): string[] {
        return [
            "\techo [SHORT-OPTION]... [STRING]...",
            "\techo LONG-OPTION"
        ]
    }

    
    public __execute(tokens:Tokens){
        const results = extractFlagsAndOptions(tokens);
        
        let content = results.remainingTokens.join(' ');
        for(let flag of results.flags){
            switch(flag){
                case "r":{
                    content = addColor(content, Colors.red);
                    break;
                }
                case "reverse": {
                    content = [...content].reverse().join('');
                    break;
                }
                default: {
                    throw new InvalidFlagError(flag);
                }
            }
        }
        
        for (let option in results.options){
            switch(option){
                case "color": {
                    const userColor = results.options.color;
                    if (userColor in Colors === false) throw new InvalidColorError(userColor);
                    content = addColor(content, userColor);
                    break;
                }
                case "l":
                case "loop":{
                    const count = Number(results.options["l"] || results.options["loop"]);
                    console.log(count);
                    if(Number.isNaN(count)) throw new InvalidNumberError(results.options['l'] || results.options["loop"]);
                    
                    // FIXME: vvvv
                    // @ts-ignore
                    content = new Array(count).fill(content);
                    
                    
                    break;
                }
                default:{
                    throw new InvalidOptionError(option);
                }
            }
        }

        TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(content));
    }   
    public handleErrors(err:any){
        
        if(err instanceof InvalidColorError){
            TerminalOutputHandler.standardErrorOutput([
                `InvalidColorError: Color (${err.color}) does not exsists`,
                `valid colors only include ${Object.values(Colors).join(', ')}`
            ])
            return;
        } else if(err instanceof InvalidNumberError) {
            TerminalOutputHandler.standardErrorOutput([
                `InvalidNumberError: Error in parsing ${addColor(err.num, Colors.yellow_light)}. Enter a valid number`
            ]);
            return;
        }
        else{
            processGenericErrors(err);
            return;
        }
    }
}