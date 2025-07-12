/**
 * (syntax)
 * Tokenizes command and returns array of tokens based on rules: 
 * 1. Tokens are splitted on spaces
 * 2. All tokens enclosed within similar quotes (" or ') form a singular token
 * 3. Words cannot have quotations in middle
 * 4. Commands cannot start with quotes
 * 5. All quotes must be paired
 */

import { CommandContainsUnpairedQuoteError, CommandStartsWithQuotesError, TokenContainsQuoteInMiddleErrror } from "./__errors";
import type { TQuote, TCommand, Tokens } from "./__typing";

function startsWithQuote(str: string): boolean {

    return /(?<!\\)^[\'\"]/.test(str);
}
function containsUnescapedQuoteInMiddle(str: string): boolean {
    for (let i = 1; i < str.length - 1; i++) {
        const char = str[i];
        const prev = str[i - 1];

        if ((char === '"' || char === "'") && prev !== '\\') {
            return true; // quote in the middle and not escaped
        }
    }
    return false;
}

function endsWithQuote(str: string): boolean {
    return /(?<!\\)[\'\"]$/.test(str);
}

/**
 * Example Usage
    try{
       const toks = tokenize(command);
    } catch(err) {
        if(err instanceof Error){
            errorHandle()
        }
    }
    doSmthh

 * 
 */

export function tokenize(command: TCommand): Tokens {
    let currentToken: string = '';
    let lastSeenQuote: TQuote | undefined = undefined;
    let allQuotesPaired = true;

    //all the parsed tokens
    let processedTokenStack: Tokens = [];

    //acts as buffer storage for currently processing tokens
    let currentTokenStack: Tokens = [];


    if (startsWithQuote(command)) {
        throw new CommandStartsWithQuotesError(command);
    }

    const tokens = command.split(' ').filter(Boolean);

    for (let index = 0; index < tokens.length; index++) {
        currentToken = tokens[index];

        if (lastSeenQuote == undefined && containsUnescapedQuoteInMiddle(currentToken)) {
            // all quotes are unpaired and current token contains a quote in middle

            throw new TokenContainsQuoteInMiddleErrror(currentToken);
        }

        if (lastSeenQuote == undefined
            && allQuotesPaired == true
            && startsWithQuote(currentToken)) {

            // start of quotation
            lastSeenQuote = currentToken[0] as TQuote;
            allQuotesPaired = false;

            
            if(endsWithQuote(currentToken) && currentToken.endsWith(lastSeenQuote)){
                lastSeenQuote = undefined;
                allQuotesPaired = true;
                processedTokenStack.push(currentToken.slice(1, -1));
            } else {
                currentTokenStack.push(currentToken.slice(1));
            }
            
        } else if (lastSeenQuote != undefined
                && allQuotesPaired == false
                && endsWithQuote(currentToken)
                && currentToken.endsWith(lastSeenQuote)) {
                    
            // end of quotation
            lastSeenQuote = undefined;
            allQuotesPaired = true;

            // push token without the quote
            currentTokenStack.push(currentToken.slice(0, -1));

            processedTokenStack.push(currentTokenStack.join(' '));
            currentTokenStack = [];

        } else if (lastSeenQuote != undefined
            && allQuotesPaired == false) {
            //current token is possibly in between a pair of quotations
            currentTokenStack.push(currentToken);
        } else {
            processedTokenStack.push(currentToken);
        }
    }

    // after iterating over all quotes
    if (allQuotesPaired == false) {
        console.log("unpaired quote")
        throw new CommandContainsUnpairedQuoteError(command);
    }
    return processedTokenStack;
}


// char wise tokenizer
// public tokenize(command:TCommand): Tokens {
//     const DELIM = " ";
//     const SINGLE_QUOTE = "'";
//     const DOUBLE_QUOTE = '"';
//     for(let index=0; index<command.length; index++) {
//         const char = command[index];

//         if(char === DELIM){
//             this.processedTokenStack.push(this.currentTokenStack.join(''));
//         }


//         if(char === SINGLE_QUOTE || char === DOUBLE_QUOTE){

//         }
//     }
// }
/**
 * Quotations must start at the start of token and end at the end of token 
 * and tokens cannot contain unescaped quotations in the middle of the word
 * eg 
 *      allowed -> hell\'o
 *      not allowed -> hell'o
 */


// const escapedCharacterRegex = /\\([\S])/g



// -- -- -- 

