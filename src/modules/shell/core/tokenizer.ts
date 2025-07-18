import { CommandContainsUnpairedQuoteError, CommandStartsWithQuotesError, TokenContainsQuoteInMiddleErrror } from "./__errors";
import type { TQuote, TCommand, Tokens } from "./__typing";
import { SPACE } from "./shell";

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
 * Does Syntax analysis and splitting of input command into meaningful and parsable tokens.
 * Tokenziation is done on the following rules:
 * 0. All tokens are split based on spaces ie splitting works on word breaks
 * 1. Words enclosed within pair of similar quotes form a single token and presence of dissimilar quotes dont affect the outer quotation. That is > The "quick 'brown' fox" jumps < would get tokenzied into [The, quick 'brown' fox, jumps]
 * 3. All unescaped quotes must be paired
 * 4. Quotes can be escaped using a backslash (\). Escaped quotes dont affect the quotation logic. That is > Hello Wo\'rld < would be tokenzied into [Hello, Wo\'rld]
 */
export function tokenize(command: TCommand): Tokens {
    let currentToken: string = '';
    let lastSeenQuote: TQuote | undefined = undefined;
    let allQuotesPaired = true;

    //all the parsed tokens
    let processedTokenStack: Tokens = [];

    //stores currently processing tokens
    let currentTokenStack: Tokens = [];

    if (startsWithQuote(command)) throw new CommandStartsWithQuotesError(command);

    const tokens = command.split(SPACE).filter(Boolean);

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

            processedTokenStack.push(currentTokenStack.join(SPACE));
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
// 







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

