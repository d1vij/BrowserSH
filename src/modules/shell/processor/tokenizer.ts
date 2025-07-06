/**
 * (syntax)
 * Tokenizes command and returns array of tokens based on rules: 
 * 1. Tokens are splitted on spaces
 * 2. All tokens enclosed within similar quotes (" or ') form a singular token
 * 3. Words cannot have quotations in middle
 * 4. Commands cannot start with quotes
 * 5. All quotes must be paired
 */

import type { TQuote, TCommand } from "./typing/types";
import { TokenizerReturnStatusCodes } from "./typing/enums";
import { addColor, OutputTemplates} from "../output-handler/formatter";
import { Colors } from "../output-handler/typing/enums";
import { TerminalOutputHandler } from "../output-handler/terminal-output-handler";

    
function clean(command: TCommand) {
    return command.trim();
}
function startsWithQuote(str: string): boolean {
    return /^[\'\"]/i.test(str);
}
function containsQuote(str: string): boolean {
    return /\w+[\'\"]\w+/i.test(str);
}
function endsWithQuote(str: string): boolean {
    return /\w+[\'\"]$/i.test(str);
}

function formatErrors(instance:Tokenizer): string{
    /**
     * TokenizationError: Command starts with quotes
     * "echo hello world cannot start with quotations
     * 
     * TokenizationError: Unparied quote
     */

    let _output;

    switch(instance.status){
        case TokenizerReturnStatusCodes.ERROR_COMMAND_STARTS_WITH_QUOTES:{
            _output = [
                "TokenizationError: Command starts with quotations",
                `${addColor(instance.command, Colors.yellow_light)}, cannot start with quotations`
            ]
            break;
        }
        case TokenizerReturnStatusCodes.ERROR_TOKEN_CONTAINS_QUOTE_IN_MIDDLE:{
            const errAt = /(?:\w+\s+)?\w+[\'\"]\w+(?:\s+\w+)?/i.exec(instance.command)![0];
            _output = [
                "TokenizationError: Command contains quote in middle",
                `Error at ${addColor(errAt, Colors.yellow_light)} in command ${instance.command}`
            ]
            break;
        }
        case TokenizerReturnStatusCodes.ERROR_QUOTE_UNPAIRED:{
            _output = [
                "TokenizationError: Command contains unpaired quote in middle",
                addColor("TODO: BEAUTIFY", Colors.yellow_light)
            ]
            break;
        }
        default:{
            throw new Error(`Invalid Status Code ${instance.status}`);
        }
    }
    return OutputTemplates.standardTerminalOutput(_output!.map(ln => addColor(ln, Colors.red)));
}


export class Tokenizer {
    /**
     * Class Usage
     * 
     * {
     *      const toks = new Tokenizer(<command>);
     *      if(toks.success) doSomethingWithTokens(toks.getTokens())
     *      else toStandardTerminalOutput(toks.getErrorMessage())
     * }
     */

    private processedTokenStack: string[] = [];  //all the parsed tokens
    
    //acts as buffer storage for currently processing tokens
    private currentTokenStack: string[] = [];

    private allQuotesPaired = true; //are all quotes in valid positions in string  paired?
    private lastSeenQuote: TQuote | undefined = undefined; //undefined implies no quote unpaired quote was seen previously

    private currentToken: string = "";

    public status: TokenizerReturnStatusCodes;
    public success;
    public command: string;

    public constructor(command: TCommand) {
        this.command = command;
        this.status = this.tokenize(clean(command));
        if(this.status==TokenizerReturnStatusCodes.SUCCESS) this.success = true;
        return;
    }

    /**
     * Returns array of parsed tokens if tokenization status is Success
     */
    public getTokens(): Array<string>{
        
        if(this.status!==TokenizerReturnStatusCodes.SUCCESS){
            throw new Error(`Cannot get parsed tokens when tokenization status is error: ${this.status}`)
        }
        return this.processedTokenStack;
    }
    /**
     * Returns formatted Error message if tokenization yeilded error
     */
    public getErrorMessage(): string{
        if(this.status==TokenizerReturnStatusCodes.SUCCESS){
            throw new Error("Cannot get Error context when tokenization status is Success");
        }
        return formatErrors(this);
    }
    
    
    private tokenize(command: TCommand): TokenizerReturnStatusCodes {
        if (startsWithQuote(command)) {
            return TokenizerReturnStatusCodes.ERROR_COMMAND_STARTS_WITH_QUOTES
        }

        const tokens = command.split(' ');

        for (let index = 0; index < tokens.length; index++) {
            this.currentToken = tokens[index];

            if (this.lastSeenQuote == undefined && containsQuote(this.currentToken)) {
                // all quotes are unpaired and current token contains a quote in middle

                return TokenizerReturnStatusCodes.ERROR_TOKEN_CONTAINS_QUOTE_IN_MIDDLE;
            }

            if (this.lastSeenQuote == undefined
                && startsWithQuote(this.currentToken)) {
                // start of quotation
                this.lastSeenQuote = this.currentToken[0] as TQuote;
                this.allQuotesPaired = false;

                this.currentTokenStack.push(this.currentToken.slice(1));

            } else if (this.lastSeenQuote != undefined
                && endsWithQuote(this.currentToken)
                && this.currentToken.endsWith(this.lastSeenQuote)) {
                // end of quotation
                this.lastSeenQuote = undefined;
                this.allQuotesPaired = true;
                this.currentTokenStack.push(this.currentToken.slice(0, -1));

                this.processedTokenStack.push(this.currentTokenStack.join(' '));
                this.currentTokenStack = [];
            } else {
                // no quotation
                this.processedTokenStack.push(this.currentToken);
            }
        }
        // after iterating over all quotes
        if (this.allQuotesPaired == true) {
            if (endsWithQuote(this.currentToken)) {
                return TokenizerReturnStatusCodes.ERROR_QUOTE_UNPAIRED;
            }
        } else {
            return TokenizerReturnStatusCodes.ERROR_QUOTE_UNPAIRED
        }
        return TokenizerReturnStatusCodes.SUCCESS;
    }
}
