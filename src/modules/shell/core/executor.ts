import { __shell } from "../../../main";
import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
import { OutputTemplates } from "../../output-handler/formatter";
import type { Tokens } from "./typing/types";
import { varNameRegex } from "./parser";

export class VariableValueIsMultipleWords extends Error {
    constructor(message: string) {
        super(`VariableValueLengthError: ${message}`);
        this.name = 'VariableValueLengthError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function assignVariable(tokens: Tokens) {
    if (tokens.length > 3) throw new VariableValueIsMultipleWords(tokens.toString()); //multi word values to be enclosed in quotations
    console.log(varNameRegex.exec(tokens[0]));
    const name = varNameRegex.exec(tokens[0])![1]
    const value = tokens[2]
    __shell.globals.vars.set(name, value);
    
    TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput("variable set")); //empty line //TODO:prolly improve this

}