import { addColor, OutputTemplates } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/typing/enums";
import type { Tokens } from "../../core/__typing";
import { getCommandContext } from "../../core/extract";
import { InvalidColorError, InvalidFlagError, InvalidNumberError, InvalidOptionError } from "../__errors";
import { AbstractCommand } from "../AbstractCommand";
import { processGenericErrors } from "../processGenericErrors";


export class Echo extends AbstractCommand {
    public name = "echo";
    public flags: string[] = ['r','reverse'];
    public options: string[] = ['colors', 'l', 'loop'];

    public info(): string[] {
        return [
            "display a line of text"
        ];
    }

    public usage(): string[] {
        return [
            "usage: echo [*args] [flags] [options]",
            "",
            "Flags include:",
            `\t${addColor("r", Colors.yellow_light)} -> red color to output string`,
            `\t${addColor("reverse", Colors.yellow_light)} -> reverse the output string`,
            "",
            "Options include:",
            `\t${addColor("color", Colors.yellow_light)} : Valid colors - ${Object.values(Colors).join(', ')}`,
            `\t${addColor("l | loop", Colors.yellow_light)} : count - how many times to repeat the output (on newlines)`,
            "Examples:",
            `\t echo Hello World "my name is divij"\t=> Strings can be quoted, unquoted, or a combination`,
            `\t echo $name '$age'\t\t\t=> Variables can be in quotations or used directly`,
            `\t echo $1 --color red -l 10\t\t=> Uses variable $1, red color, and loops 10 times`
        ];
    }

    public __execute(tokens:Tokens){
        const results = getCommandContext(tokens);
        
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