import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
import { InvalidFlagError, InvalidOptionError } from "./__errors";

export function processGenericErrors(err: InvalidFlagError | InvalidOptionError) {
    // processing 
    // FIXME:
    TerminalOutputHandler.printToTerminal(err.toString());
    console.log(err);
    if (err instanceof InvalidFlagError) {

    } else if (err instanceof InvalidOptionError) {

    }
}