// main executor shell 

import { parse } from "./parser";
import { execute } from "./executor";
import { tokenize } from "./tokenizer";
import type { parserResults } from "./__typing";
import { Colors } from "../../output-handler/typing/enums";
import { GlobalsFactory } from "../components/globals-factory";
import { VariableDoesNotExistsError } from "../components/__errors";
import { UserInputHandler } from "../../output-handler/user-input-handler";
import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";

import type {
    TCommand,
    Tokens
} from "./__typing";
import {
    addColor,
    OutputTemplates,
    updatePrimaryPrompt
} from "../../output-handler/formatter";

import {
    VariableValueIsMultipleWords,
    CommandContainsUnpairedQuoteError,
    CommandStartsWithQuotesError,
    TokenContainsQuoteInMiddleErrror,
    UndefinedCommandError
} from "./__errors"
import { terminalInputDiv } from "../../../domElements";



// 
export class Shell {
    /**
     * shell will 
     * first tokenize
     * then parse
     * then execute
     * then resolve (ie output to terminal)
     * 
     * resolution can come after any step using exception raising & handling
     */
    public globals: GlobalsFactory;
    constructor() {
        // initializes a new shell 
        this.globals = new GlobalsFactory();

    }
    public process() {
        const command = UserInputHandler.getUserInput();

        TerminalOutputHandler.printToTerminal(OutputTemplates.userInputPreview(command));
        UserInputHandler.clearUserInput();

        // Command input feild is hidden once command processing starts
        commandInputFeildHidden(true);
        
        let toks: Tokens = [];
        try {
            toks = tokenize(command);
        } catch (err: any) {
            handleTokenizationErrors(err, command)
            commandInputFeildHidden(false);
            return;
        }

        let results: parserResults;
        try {
            results = parse(toks);
        } catch (err) {
            handleParserErrors(err);
            commandInputFeildHidden(false);
            return;
        }
        
        try {
            execute(results,()=>{
                // the callback which gets called once command execution is finished, here it shows the command input feild and resets the primary prompt
                commandInputFeildHidden(false);
                updatePrimaryPrompt()
            });
        } catch (err) {
            handleExecutorErrors(err);
            commandInputFeildHidden(false);
            return;
        }
        
    }
}

// 

function commandInputFeildHidden(b:boolean) {
    console.log("hiding", b)
    if(b) terminalInputDiv.style.display = "none";
    else terminalInputDiv.style.display = "flex";
}

// 


function handleExecutorErrors(err: any) {
    if (err instanceof VariableValueIsMultipleWords || err.name === "VariableValueIsMultipleWords") {
        TerminalOutputHandler.standardErrorOutput([
            `VariableValueIsMultipleWords: variables cannot be set values as multiple tokens, pass multiple words in quotations as single token.`
        ])
    }
    else if (err instanceof UndefinedCommandError) {
        TerminalOutputHandler.standardErrorOutput([
            `UndefinedCommandError: Command ${addColor(err.command, Colors.yellow_light)} does not exsits!`
        ])
    }
}


function handleParserErrors(err: any) {
    if (err instanceof VariableDoesNotExistsError) {
        TerminalOutputHandler.standardErrorOutput([
            `VariableDoesNotExistsError: Variable with name ${err.varName} does not exists !`
        ])
    }
}

function handleTokenizationErrors(err: Error, command: TCommand) {
    if (err instanceof CommandStartsWithQuotesError) {
        TerminalOutputHandler.standardErrorOutput([
            "TokenizationError: Command starts with quotations",
            `${addColor(command, Colors.yellow_light)}, cannot start with quotations`
        ])
        return;
    }
    else if (err instanceof TokenContainsQuoteInMiddleErrror) {
        const errAt = /(?:\w+\s+)?\w+[\'\"]\w+(?:\s+\w+)?/i.exec(command)![0];
        TerminalOutputHandler.standardErrorOutput([
            "TokenizationError: Command contains quote in middle",
            `Error at ${addColor(errAt, Colors.yellow_light)} in command ${command}`
        ])
        return;
    }
    else if (err instanceof CommandContainsUnpairedQuoteError) {
        TerminalOutputHandler.standardErrorOutput([
            "TokenizationError: Command contains unpaired quote",
            addColor("TODO: BEAUTIFY", Colors.yellow_light)
        ])
        return;
    }
    else {
        TerminalOutputHandler.standardErrorOutput(['unexpected error', err as any]) //FIXME: err as any
        return;
    }
}