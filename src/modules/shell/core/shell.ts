import { parse } from "./parser";
import { execute } from "./executor";
import { tokenize } from "./tokenizer";
import type { ParserResults } from "./__typing";
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
import { terminalInputDiv } from "../../../dom-elements";

export const SPACE = ' ';



/**
 * THe main shell factory - instantiates the "shell" object, which implements the core command processing logic pipeline.
 * 
 * What shell does ?
 * Core Processing Pipeline
 * 1. Tokenization → 2. Parsing → 3. Execution → 4. Output Resolution
 * Each stage handles specific aspects of command processing and holds the ability to terminate the pipeline to directly resolve exceptions.
 * 0. Upon instantiation, ie on start of program instantiates a "globals" property which acts as the "system environment" for other components.
 * 1. Shell recieves raw input command which then is first tokenized into array of strings.
 * 2. The tokens are passed to Parser, which idenfies the semantics of the tokens and tells how to go about with the execution.
 * 3. Executor recives the results of parser and finds the appropriate executor for the command.
 * 
 * Features of Terminal
 * * Inbuild variable system
 * * Emulated file-system along with commands for traversal and modification of the same.
 * * All components / classes / functions follow the ideology of "Do one thing and do it well" and Modularity.
 * * Core Components like  Output Handlers, Global State etc are abstracted from other componets and then "expose an api" for interaction with other components. They further use other abstracted components
 * * Each component has its own set of exceptions to handle most (almost all) edge cases
 * 
 * Sources
 * * https://www.linux.org/threads/bash-03-%E2%80%93-command-line-processing.38676/
 * * https://github.com/0l1v3rr/0l1v3rr.github.io (inspiration)
 * 
 */
export class Shell {

    public globals: GlobalsFactory;
    constructor() {
        // initializes a new shell 
        this.globals = new GlobalsFactory();

    }
    public process() {
        const command = UserInputHandler.getUserInput();

        TerminalOutputHandler.printToTerminalOld(OutputTemplates.userInputPreview(command));
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

        let results: ParserResults;
        try {
            results = parse(toks);
        } catch (err) {
            handleParserErrors(err);
            commandInputFeildHidden(false);
            return;
        }

        try {
            execute(results, () => {
                // the callback which gets called once command execution is finished,
                // here it shows the command input feild and resets the primary prompt
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

function commandInputFeildHidden(b: boolean) {
    console.log("hiding", b)
    if (b) terminalInputDiv.style.display = "none";
    else terminalInputDiv.style.display = "flex";
}

// 


function handleExecutorErrors(err: any) {
    if (err instanceof UndefinedCommandError) {
        TerminalOutputHandler.standardErrorOutput([
            `UndefinedCommandError: Command ${addColor(err.command, Colors.yellow_light)} does not exsits!`
        ])
    }
}


function handleParserErrors(err: any) {
    if (err instanceof VariableValueIsMultipleWords || err.name === "VariableValueIsMultipleWords") {
        TerminalOutputHandler.standardErrorOutput([
            `VariableValueIsMultipleWords: variables cannot be set values as multiple tokens, pass multiple words in quotations as single token.`
        ])
    }
    else if (err instanceof VariableDoesNotExistsError) {
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