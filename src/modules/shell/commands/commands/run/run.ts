import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { FunctionNotFoundError, IncorrectArgumentsCountError } from "../../__errors";
import type { MaybeAsyncFunction } from "../../__typing";
import { AbstractCommand } from "../../AbstractCommand";
import { setup } from "./_setup";

/**
 * For running inbuilt scripts which dont require user input, these scripts can also be run from any internal command
 */
export class Run extends AbstractCommand {
    public name: string = "run";
    public flags: string[] = [];
    public options: string[] = [];

    public functionIndex: Record<string, MaybeAsyncFunction<void>> = {
        "setup": setup
    }
    public handleErrors(err: any): void {
        if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `This command only takes one argument! Pass any paths with spaces inside quotations!`
            ])
        } else if (err instanceof FunctionNotFoundError){
            TerminalOutputHandler.standardErrorOutput([
                `No function found with name ${err.funcname}, use ${addColor("list functions", Colors.blue_cool)} to view available functions.`
            ])
        } else {
            TerminalOutputHandler.standardErrorOutput(err.name);
        }
    }

    protected async __execute(tokens: Tokens): Promise<void> {
        console.log("running")
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);

        const funcName = results.remainingTokens[0];
        const func = this.functionIndex[funcName];
        if (func === undefined) throw new FunctionNotFoundError(funcName);

        return await func();
    }
    public info(): string[] {
        return [
            "Executes a predefined inbuilt script function by name."
        ];
    }

    public usage(): string[] {
        return [
            addColor("usage: run", Colors.blue_light) + " " + addColor("<function-name>", Colors.yellow_light),
            "",
            addColor("Arguments", Colors.green),
            "\t" + addColor("<function-name>", Colors.yellow_light) + "\tName of the inbuilt script function to execute",
            "",
            addColor("Examples", Colors.green),
            "\t" + addColor("run setup", Colors.blue_light) + " => runs the internal setup script",
            "",
            "Note:",
            "\tOnly one argument is allowed. Enclose names with spaces in double quotes.",
            "\tUse " + addColor("list functions", Colors.blue_light) + " to view all available script functions."
        ];
    }

    
}