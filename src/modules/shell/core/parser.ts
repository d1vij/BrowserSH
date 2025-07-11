/**
 * (semantics)
 */

import type { Tokens } from "./typing/types"
import { __shell } from "../../../main";
import { VariableDoesNotExistsError } from "../components/variables-factory";


export const varNameRegex = /\$([^\s]+)/g
// export const escapedVariableRegex = /(?<!\\)\$(.*\b)/g
export const escapeRegex = /\\([^\s])/g


const DELIM = ' '


export interface parserResults {
    type: "command" | "variable-assignment"
    command?: string; //name of primary command
    tokens?: Tokens;

}

export function parse(tokens: Tokens): parserResults {

    // check 1 - is command  a variable assignment?
    // eg $name = divij
    if (isVariableAssignment(tokens)) {
        return {
            type: "variable-assignment",
            tokens: tokens
        }
    }

    // variable insertions
    tokens = tokens.map((token) => {
        return token.replace(varNameRegex, (_, name) => {
            const value = __shell.globals.vars.get(name);
            if (value === undefined) throw new VariableDoesNotExistsError(name, name)
            return value;
        })
    })


    // escaping backslash characters (un-nessasary for anything other than escacaping $ signs)
    tokens = tokens.map(token => token.replace(escapeRegex, "$1"))
    
    console.log(tokens);
    const primaryCommand = tokens[0].trim()
    return {};
}

export function extractFlags(tokens: Tokens) {

}




function isVariableAssignment(tokens: Tokens): boolean {
    const _namePrefixTokMatch = Boolean(varNameRegex.exec(tokens[0]));
    const _equalsTokMatch = Boolean(/\=/.exec(tokens[1]))
    return _namePrefixTokMatch && _equalsTokMatch;
}
