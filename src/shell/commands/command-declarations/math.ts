import { SHELL } from "../../../main";
import { addColor } from "../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { Colors } from "../../../output-handler/colors";
import type { Tokens } from "../../core/__typing";
import { getCommandContext } from "../../core/extract";
import { IncorrectArgumentsCountError, InvalidNumberError, InvalidOperationError } from "../errors";
import { AbstractCommand } from "../AbstractCommand";

// command with subcommands
export class MathCommand extends AbstractCommand {
    public name = "math";
    public subcommands: Array<string> = ["add", "sub", "mul", "div"];
    public flags = [];
    public options = ["out", 'o']

    public info() {
        return [
            "Perform basic arithmetic operations using subcommands.",
            "",
            "Subcommands include:",
            `\t${addColor("add", Colors.yellow_light)} -> adds all the given numbers`,
            `\t${addColor("sub", Colors.yellow_light)} -> subtracts subsequent numbers from the first`,
            `\t${addColor("mul", Colors.yellow_light)} -> multiplies all the numbers`,
            `\t${addColor("div", Colors.yellow_light)} -> divides the first number by the second (exactly 2 args)`,
            "",
            "Flags include:",
            `\t${addColor("-o", Colors.yellow_light)}   -> save result to a variable (default name: math_result)`,
            "",
            "Options include:",
            `\t${addColor("--out", Colors.yellow_light)} : assign result to a variable with the given name`,
        ];
    }

    public usage() {
        return [
            "usage: math <subcommand> [*args] [flags] [options]",
            "",
            "Examples:",
            `\t math add 4 5 6\t\t\t=> returns 15`,
            `\t math sub 20 5 3\t\t=> returns 12`,
            `\t math mul 2 3 4\t\t=> returns 24`,
            `\t math div 100 2\t\t=> returns 50`,
            `\t math add $a $b\t\t=> supports variable expansion`,
            `\t math mul 5 6 -o\t\t=> stores result in variable 'math_result'`,
            `\t math mul 5 6 --out result\t=> stores result in variable 'result'`,
        ];
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
            SHELL.globals.vars.set(varname, result.toString());

            TerminalOutputHandler.printToTerminal(`Result saved to var ${addColor(varname, Colors.yellow_light)}.`);
            return;
        } else {
            // print to terminal
            TerminalOutputHandler.printToTerminal(addColor(result.toString(), Colors.yellow_light));
            return;
        }
    }
    protected handleErrors(err: any): void {
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