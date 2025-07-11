// main executor shell 

import { GlobalsFactory } from "../components/globals-factory";
import { CommandContainsUnpairedQuoteError, CommandStartsWithQuotesError, TokenContainsQuoteInMiddleErrror, tokenize } from "./tokenizer";
import type { TCommand, Tokens } from "./typing/types";
import { addColor, OutputTemplates } from "../../output-handler/formatter";
import { Colors} from "../../output-handler/typing/enums";
import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
import { UserInputHandler } from "../../output-handler/user-input-handler";
import { parse, type parserResults } from "./parser";
import { VariableDoesNotExistsError } from "../components/variables-factory";
import { assignVariable, VariableValueIsMultipleWords } from "./executor";

const __debugTrue = "true"


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
        this.globals.vars.set("__debug",__debugTrue)
    }
    public process() {
        const command = UserInputHandler.getUserInput();
        
        // command.replace(/(\\)/g, "//");
        
        TerminalOutputHandler.printToTerminal(OutputTemplates.userInputPreview(command));
        UserInputHandler.clearUserInput();
        
        let toks: Tokens = [];
        try {
            toks = tokenize(command);
            console.log(toks);

        } catch (err:any) {
            handleTokenizationErrors(err, command)
            return;
        }

        let results: parserResults;
        try{
            results = parse(toks);
        } catch(err){
            handleParserErrors(err)
            return;
        }

        try{
            if(results.type=="variable-assignment" && results.tokens){
                console.log("var assingment")
                assignVariable(results.tokens);
            }
        }catch(err){
            if(err instanceof VariableValueIsMultipleWords){
                TerminalOutputHandler.standardError([
                    `VariableValueIsMultipleWords: variables cannot be set values as multiple tokens, pass multiple words in quotations as single token.`
                ])
            }
        }
    }
}

function handleParserErrors(err:any){
    if(err instanceof VariableDoesNotExistsError){
        TerminalOutputHandler.standardError([
            `VariableDoesNotExistsError: Variable with name ${err.varName} does not exists !`
        ])
    }
}

function handleTokenizationErrors(err:Error, command:TCommand) {
    if (err instanceof CommandStartsWithQuotesError) {
        TerminalOutputHandler.standardError([
            "TokenizationError: Command starts with quotations",
            `${addColor(command, Colors.yellow_light)}, cannot start with quotations`
        ])
        return;
    }
    else if (err instanceof TokenContainsQuoteInMiddleErrror) {
        const errAt = /(?:\w+\s+)?\w+[\'\"]\w+(?:\s+\w+)?/i.exec(command)![0];
        TerminalOutputHandler.standardError([
            "TokenizationError: Command contains quote in middle",
            `Error at ${addColor(errAt, Colors.yellow_light)} in command ${command}`
        ])
        return;
    }
    else if (err instanceof CommandContainsUnpairedQuoteError) {
        TerminalOutputHandler.standardError([
            "TokenizationError: Command contains unpaired quote",
            addColor("TODO: BEAUTIFY", Colors.yellow_light)
        ])
        return;
    }
    else {
        TerminalOutputHandler.standardError(['unexpected error', err as any]) //FIXME: err as any
        return;
    }
}