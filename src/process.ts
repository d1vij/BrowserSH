import { InvalidCommandError, InvalidFlagError, InvalidOptionError } from "./modules/commands/errors";
import { KnownCommands } from "./modules/commands/known-commands";
import { OutputTemplates } from "./modules/output-handler/formatter";
import { TerminalOutputHandler } from "./modules/output-handler/terminal-output-handler";
import { UserInputHandler } from "./modules/output-handler/user-input-handler";
import { parseCommand } from "./modules/shell/core/parser-legacy";

/**
 * Processes command
 */

export function process(){
    const userCommand = UserInputHandler.getUserInput() as string;
    const parsed = parseCommand(userCommand);
    const primaryCommand = KnownCommands[parsed.command]; 

    const userInput = UserInputHandler.getUserInput("string");
    TerminalOutputHandler.printToTerminal(OutputTemplates.userInputPreview(userInput as string));
    UserInputHandler.clearUserInput();

    if(primaryCommand == undefined) {
        new InvalidCommandError(userCommand);
        return;
    }
    for (let flag of parsed.flags) {
        if (primaryCommand.flags.includes(flag) == false) {
            new InvalidFlagError(flag, primaryCommand.primary, primaryCommand.flags)
            return;
        }
    }
    for (let option of Object.keys(parsed.options)) {
        if (primaryCommand.options.includes(option) == false) {
            new InvalidOptionError(option, primaryCommand.primary, primaryCommand.options);
            return;
        }
    }
        
    primaryCommand.execute(parsed);
}