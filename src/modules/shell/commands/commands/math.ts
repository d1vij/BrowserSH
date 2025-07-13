import { __shell } from "../../../../main";
import { addColor, OutputTemplates } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/typing/enums";
import type { Tokens } from "../../core/__typing";
import { extractFlagsAndOptions } from "../../core/extract";
import { IncorrectArgumentsCountError, InvalidNumberError, InvalidOperationError } from "../__errors";
import { AbstractCommand } from "../AbstractCommand";

// command with subcommands
export class MathCommand extends AbstractCommand{
    public name = "math";
    public subcommands: Array<string> = ["add", "sub", "mul", "div"];
    public flags = [];
    public options = ["out",'o']

    public execute(tokens: Tokens): void {
        try{
            this.__execute(tokens);
        } catch(err){ 
            this.handleErrors(err);
            return;
        }
    }
    public info() {
        return ["TODO"]
    }
    public usage() {
        return ["TODO"]
    }

    private __execute(tokens:Tokens){
        
        const operation = tokens.splice(0,1)[0];
        const results = extractFlagsAndOptions(tokens);
        const nums = results.remainingTokens.map(tok => {
            const num = Number(tok)
            
            if(isNaN(num)) throw new InvalidNumberError(tok);
            return num;
        })
        
        let result: number;
        switch(operation){
            case "add":{
                result = 0;
                for(let i=0; i<nums.length; i++){
                    result += nums[i];
                }
                break;
            }
            case "sub":{
                // FIXME: whatevr
                result = 0;
                for(let i=0; i<nums.length; i++){
                    result -= nums[i];
                }
                break;
            }
            case "mul":{
                result = 1;
                for(let i=0; i<nums.length; i++){
                    result *= nums[i];
                }
                break;
            }
            case "div":{
                if(nums.length > 2) throw new IncorrectArgumentsCountError(2,nums.length);
                
                result = nums[0] / nums[1]; //crazy that js doesnt complain on invalid divisions
                break;
            }
            default:{
                throw new InvalidOperationError(operation);
            }
        }

        if("out" in results.options || 'o' in results.options){
            // save result in variable
            const arg = results.options.out || results.options.o;
            const varname = arg || "math_result";
            __shell.globals.vars.set(varname, result.toString());

            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(`Result saved to var ${addColor(varname, Colors.yellow_light)}.`));
            return;
        } else {
            // print to terminal
            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(addColor(result.toString(), Colors.yellow_light)));
            return;
        }
    }
    public handleErrors(err: any): void {
        if(err instanceof InvalidNumberError || err.name === "InvalidNumberError"){
            TerminalOutputHandler.standardErrorOutput([
                `InvalidNumberError: Error in parsing ${addColor(err.num, Colors.yellow_light)}. Enter a valid number`
            ]);
            return;

        } else if(err instanceof InvalidOperationError){
            TerminalOutputHandler.standardErrorOutput([
                `InvalidOperationError: Operation ${addColor(err.operation, Colors.yellow_light)} is unsupported.`,
                `Valid operations include ${addColor(this.subcommands.join(', '), Colors.yellow_light)}.`
            ])
        } else if (err instanceof IncorrectArgumentsCountError){
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArguemntsCountError: Command expects ${addColor(err.expected.toString(), Colors.yellow_light)} arguemnts, passed were ${addColor(err.got.toString(), Colors.yellow_light)}.`
            ])
        }
    }
}