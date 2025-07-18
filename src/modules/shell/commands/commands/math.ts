import { __shell } from "../../../../main";
import { addColor } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/typing/enums";
import type { Tokens } from "../../core/__typing";
import { getCommandContext } from "../../core/extract";
import { IncorrectArgumentsCountError, InvalidNumberError, InvalidOperationError } from "../__errors";
import { AbstractCommand } from "../AbstractCommand";

// command with subcommands
export class MathCommand extends AbstractCommand {
    public name = "math";
    public subcommands: Array<string> = ["add", "sub", "mul", "div"];
    public flags = [];
    public options = ["out", 'o']

    public info() {
        return ["perform basic arithmetic operations"];

    }
    public usage() {
        return [
            "usage: math <subcommand> [*args] [flags] [options]",
            "Subcommands include",
            "\t add -> adds all the given numbers",
            "\t sub -> subtracts subsequent numbers from the first",
            "\t mul -> multiplies all the numbers",
            "\t div -> divides the first number by the second number, takes 2 arguments",
            "Options include",
            "\t -o | --output : assign the result to a variable with the given name",
            "Examples",
            "\t math add 4 5 6 => returns 15",
            "\t math sub 20 5 3 => returns 12",
            "\t math mul 2 3 4 => returns 24",
            "\t math div 100 2 5 => returns 10",
            "\t math add $a $b => supports variable expansion",
            "\t math mul 5 6 -o result => stores result in 'result' variable"]
    }

    
    protected __execute(tokens: Tokens): void {

        const operation = tokens.splice(0, 1)[0];
        const results = getCommandContext(tokens);
        
        const nums = results.remainingTokens.map(tok => {
            const num = Number(tok)

            if (isNaN(num)) throw new InvalidNumberError(tok);
            return num;
        })
        // FIXME: NEGATIVES ARE CONVERTED INTO FLAGS
        
        
        let result: number;
        switch (operation) {
            case "add": {
                result = 0;
                for (let i = 0; i < nums.length; i++) {
                    result += nums[i];
                }
                break;
            }
            case "sub": {
                // FIXME: whatevr
                result = 0;
                for (let i = 0; i < nums.length; i++) {
                    result -= nums[i];
                }
                break;
            }
            case "mul": {
                result = 1;
                for (let i = 0; i < nums.length; i++) {
                    result *= nums[i];
                }
                break;
            }
            case "div": {
                if (nums.length > 2) throw new IncorrectArgumentsCountError(2, nums.length);

                result = nums[0] / nums[1]; //crazy that js doesnt complain on invalid divisions
                break;
            }
            default: {
                throw new InvalidOperationError(operation);
            }
        }

        if ("out" in results.options || 'o' in results.options) {
            // save result in variable
            const arg = results.options.out || results.options.o;
            const varname = arg || "math_result";
            __shell.globals.vars.set(varname, result.toString());

            TerminalOutputHandler.printToTerminal(`Result saved to var ${addColor(varname, Colors.yellow_light)}.`);
            return;
        } else {
            // print to terminal
            TerminalOutputHandler.printToTerminal(addColor(result.toString(), Colors.yellow_light));
            return;
        }
    }
    public handleErrors(err: any): void {
        if (err instanceof InvalidNumberError || err.name === "InvalidNumberError") {
            TerminalOutputHandler.standardErrorOutput([
                `InvalidNumberError: Error in parsing ${addColor(err.num, Colors.yellow_light)}. Enter a valid number`
            ]);
            return;

        } else if (err instanceof InvalidOperationError) {
            TerminalOutputHandler.standardErrorOutput([
                `InvalidOperationError: Operation ${addColor(err.operation, Colors.yellow_light)} is unsupported.`,
                `Valid operations include ${addColor(this.subcommands.join(', '), Colors.yellow_light)}.`
            ])
        } else if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArguemntsCountError: Command expects ${addColor(err.expected.toString(), Colors.yellow_light)} arguemnts, passed were ${addColor(err.got.toString(), Colors.yellow_light)}.`
            ])
        }
    }
}