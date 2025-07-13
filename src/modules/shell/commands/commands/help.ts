import { OutputTemplates } from "../../../output-handler/formatter";
import { UndefinedCommandError } from "../../core/__errors";
import type { Tokens } from "../../core/__typing";
import { extractFlagsAndOptions } from "../../core/extract";
import { AbstractCommand } from "../AbstractCommand";
import { getCommandConstructor } from "../command-index";
import { TerminalOutputHandler } from "../../../output-handler/terminal-output-handler";
import { addColor } from "../../../output-handler/formatter";
import { Colors } from "../../../output-handler/typing/enums";
import { IncorrectArgumentsCountError } from "../__errors";


export class Help extends AbstractCommand {
    public name = "help";
    public flags: string[] = ['u', "usage", 'i', "info"];
    public options: string[] = ["cmd"];
    public execute(tokens: Tokens): void {
        try {
            this.__execute(tokens);
            return;

        } catch (err: any) {
            this.handleErrors(err);
            return;
        }
    }
    public info() {
        return [
            "Display information about builtin commands, or used to list all avaialable commands",
            "Options",
            "\t--usage | -u\t Shows usage info for provided command ",
        ]
    }
    public usage() {
        return [
            "help [--cmd] [COMMAND_NAME] [-u | --usage][-i | --info]",
            "eg",
            "\thelp [--cmd] echo -> info for echo",
            `\thelp echo --usage -> usage for echo`,
            "\thelp -> lists all avaialable commands",
        ]
    }

    public __execute(tokens: Tokens) {
        const results = extractFlagsAndOptions(tokens);

        console.log("help")
        let cmdName;
        if ("cmd" in results.options) {
            console.log("help")
            cmdName = results.options["cmd"];
        } else {
            if (results.remainingTokens.length > 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);
            cmdName = results.remainingTokens[0] || "help"; //default becomes help
        }

        const cmdConstruct = getCommandConstructor(cmdName);
        if (cmdConstruct == undefined) {
            throw new UndefinedCommandError(cmdName);
        }
        const instance = new cmdConstruct();

        console.log(results.flags);
        
        if (results.flags.includes("i") || results.flags.includes("info")) {
            console.log("printing info")
            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput([
                addColor(instance.name, Colors.blue_light),
                ...instance.info()
            ]))
            return;
        } else if (results.flags.includes("u") || results.flags.includes("usage")) {
            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput([
                addColor(instance.name, Colors.blue_light),
                ...instance.usage()
            ]))
            return;
        }else {
            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput([
                addColor(instance.name, Colors.blue_light),
                ...instance.info(),
                ...instance.usage()
            ]));
            return;
        }
    }


    public handleErrors(err: any): void {
        if (err instanceof UndefinedCommandError) {
            TerminalOutputHandler.standardErrorOutput([
                `UndefinedCommandError: Command ${addColor(err.command, Colors.yellow_light)} does not exsits!`
            ])
            return;
        } else if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArguemntsCountError: Command expects ${addColor(err.expected.toString(), Colors.yellow_light)} arguemnts, passed were ${addColor(err.got.toString(), Colors.yellow_light)}.`
            ])
        } else {
            TerminalOutputHandler.standardErrorOutput([err.toString()]);
        }
    }

}