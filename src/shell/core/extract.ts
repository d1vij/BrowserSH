import { addColor } from "../../output-handler/formatter";
import { Colors } from "../../output-handler/typing/enums";
import { IncorrectOptionUsageInCommandError } from "../commands/__errors";
import type { ExtractionResults, Tokens } from "./__typing";
import { test_isNumeric } from "./checks";

// "flags" are -a -f -x that is have only 1 dash, single letter-ed, not quoted, and may appear anywhere in the command and hence have to be removed out
// flags cannot be like -1 -0.5 that is with numbers, this prevents mislabeling of negative numbers as flags

// "options" are '--num 1' '--color red' that is double-dashed, single-worded, and have a value following them. 
// Can have only one value and multiple passed should be passed as a string with some kind of delimiter

const C_SINGLE_DASH = '-'
const C_DOUBLE_DASH = '--'

/**
 * extracts flags and options from tokens
 */
export function getCommandContext(tokens: Tokens): ExtractionResults {
    console.log(tokens);

    const remainingTokens: Array<string> = [];
    const flags: Array<string> = [];
    const options: Record<string, string> = {};

    for (let idx = 0; idx < tokens.length; idx++) {
        const currTok = tokens[idx];

        if (currTok.length === 2 && currTok[0] === C_SINGLE_DASH && !test_isNumeric(currTok)) {
            // current token is a flag
            flags.push(currTok[1]);
        }
        else if (currTok.length >= 3 && currTok.startsWith(C_DOUBLE_DASH, 0)) {
            // current token is an option

            const optionName = currTok.slice(2);

            if (idx + 1 >= tokens.length) throw new IncorrectOptionUsageInCommandError(`No option provided to option ${addColor(optionName, Colors.yellow_light)}`);


            const nextTok = tokens[idx + 1];
            if (nextTok.startsWith(C_DOUBLE_DASH, 0)
                || (nextTok.length === 2 && nextTok[0] === C_SINGLE_DASH && !test_isNumeric(nextTok))) throw new IncorrectOptionUsageInCommandError(`No option provided to option ${addColor(optionName, Colors.yellow_light)}`);

            options[optionName] = nextTok;
            idx++; //skip the next token

            // cmd add -1 -2 
            // cmd --color red abc
            // cmd xyx --color 1
            // cmd xyz --color -1 -p <- doesnt raises error

            // cmd xyz --color -p <-- raises error 
            // cmd xyz --color --abc 1 <-- raises error
        }
        else remainingTokens.push(currTok);
    }

    return {
        flags,
        options,
        remainingTokens
    }
}