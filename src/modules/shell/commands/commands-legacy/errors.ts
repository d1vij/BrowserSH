import { addColor, stringify } from "../output-handler/formatter";
import { Colors } from "../output-handler/typing/enums";

import { TerminalOutputHandler } from "../output-handler/terminal-output-handler";
import { OutputTemplates } from "../output-handler/formatter";
import type { TCommand, TFlag } from "../shell/typing/types";

class TerminalError {
    constructor(message: string) {
        const formatted = OutputTemplates.standardTerminalOutput(addColor(message, Colors.red));
        TerminalOutputHandler.printToTerminal(formatted);
    }
}

export class GenericError extends TerminalError {
  constructor(message: string) {
    super(message );
  }
}

export class InvalidArgumentError extends TerminalError {
  constructor(message: string) {
    super(`InvalidArgumentError: ${ message }`);
  }
}


export class InvalidCommandError extends TerminalError {
    constructor(command: TCommand) {
        super(stringify([`InvalidCommandError: Command ${addColor(command, Colors.blue_cool)} does not exists`,
        `use ${addColor("help", Colors.blue_cool)} to get all commands`
        ]));
    }
}

export class InvalidOptionError extends TerminalError {
    constructor(option: string, command: TCommand, valid: string[]) {
        super(stringify([`InvalidOptionError: Command ${addColor(command, Colors.blue_cool)} has no option like ${addColor(option, Colors.yellow_light)}`,
        `valid options include ${valid}`
        ]));
    }
}

export class InvalidFlagError extends TerminalError {
    constructor(flag: TFlag, command: TCommand, valid: TFlag[]) {
        super(stringify([`InvalidFlagError: Command ${addColor(command, Colors.blue_cool)} has no flag like ${addColor(flag, Colors.yellow_light)}`,
        `valid flags include ${valid}`
        ]));
    }
}


export class InvalidColorError extends TerminalError {
    constructor(color: string) {
        super(stringify([
            `InvalidColorError: Color (${color}) does not exsists`,
            `valid colors only include ${Object.values(Colors).join(', ')}`
        ]));
    }
}
