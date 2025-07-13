import type { ExtractionResults, Tokens } from "./__typing";


const flagOptionSearchRegex = /^-{1,2}([^\s]+)/;

/**
 * extracts flags and options from tokens
 */
export function extractFlagsAndOptions(tokens: Tokens): ExtractionResults {
    const flags = [];
    const options: Record<string, string> = {};

    for (let i = 0; i < tokens.length; i++) {
        if (flagOptionSearchRegex.test(tokens[i])) {

            // this is either a flag or option
            if (i + 1 >= tokens.length || flagOptionSearchRegex.test(tokens[i + 1])) {
                // next token is also a flag implying both of these tokens are flags
                const flag = flagOptionSearchRegex.exec(tokens[i])![1];
                flags.push(flag);
                tokens.splice(i, 1);
                i -= 1;
            } else {
                const key = flagOptionSearchRegex.exec(tokens[i])![1]
                options[key] = tokens[i + 1];
                tokens.splice(i, 2)
                i -= 2;
            }
        }
    }

    return {
        flags,
        options,
        remainingTokens: tokens
    }
}
