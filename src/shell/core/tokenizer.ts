import { CommandContainsUnescapedCharacters, CommandContainsUnpairedQuoteError, CommandStartsWithQuotesError} from "./errors";
import type { TCommand, Tokens } from "./typing";
import { Characters } from "../../characters";
/**
 * Does Syntax analysis and splitting of input command into meaningful and parsable tokens.
 * Tokenziation is done on the following rules:
 * 0. Command is split based on spaces
 * 1. Words enclosed within pair of similar 
 *    quotes form a single token and presence
 *    of dissimilar quotes dont affect 
 *    the outer quotation.
 *    That is > The "quick 'brown' fox" jumps 
 *    => would get tokenzied into [The, quick 'brown' fox, jumps]
 * 2. All quotes outside paired quotes must be escaped using backslash
 *    And Escaped quotes dont affect the quotation logic.
 *    That is > Hello Wo\'rld < would be tokenzied into [Hello, Wo'rld]
 * 3. Selected characters can be escaped using a backslash (\).
 *    That is  > Hello \nWorld <  would be tokenized into [Hello, \nWorld]
 *    if the escaped character is unknown, 
 *    it is left as it is without the backslash
 *    That is > Hello \oWorld < would be tokenized into [Hello, oWorld]
*/
export const EscapeSequences: Record<string, string> = {
    "n": "\n",
    "t": "\t",
    "\\":"\\",
    "'": "'",
    '"': '"'
}

export function tokenize(command:TCommand): Tokens{
    if(command[0] === Characters.SingleQuote || command[0] === Characters.DoubleQuote) throw new CommandStartsWithQuotesError(command);
    
    let lastSeenQuote: string | undefined = undefined;
    let processedTokens = [];
    let currentTokenStack = [];

    for(let idx=0; idx < command.length; idx++){
        const ch = command[idx];
        // echo "Hello World" "t\'is" -> echo, Hello World, t'is
        if(ch === Characters.Backslash){
            if(idx + 1 >= command.length) throw new CommandContainsUnescapedCharacters("\\");
            const nextChar = command[++idx];
            
            if(nextChar in EscapeSequences){
                currentTokenStack.push(EscapeSequences[nextChar])
            }
            else {
                currentTokenStack.push(nextChar);
            }
        }
        
        else if(ch === Characters.SingleQuote || ch === Characters.DoubleQuote){
            if(ch === lastSeenQuote){
                if(currentTokenStack.length > 0){
                    processedTokens.push(currentTokenStack.join(Characters.None));
                }
                currentTokenStack = [];
                lastSeenQuote= undefined;
            } else if (lastSeenQuote === undefined){
                lastSeenQuote = ch;
            } else {
                currentTokenStack.push(ch);
            }
            
            continue;
        } 

        else if (ch === Characters.Space){
            if(lastSeenQuote !== undefined){ //space within quotation
                currentTokenStack.push(Characters.Space);
            } else if(currentTokenStack.length > 0){
                processedTokens.push(currentTokenStack.join(Characters.None));
                currentTokenStack = [];
            }
        }
        else {
            currentTokenStack.push(ch);
        }
    }

    if(currentTokenStack.length > 0){
        processedTokens.push(currentTokenStack.join(Characters.None));
    }
    
    if(lastSeenQuote !== undefined) throw new CommandContainsUnpairedQuoteError(lastSeenQuote as unknown as string);
    return processedTokens;
}
