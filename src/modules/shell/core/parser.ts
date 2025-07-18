/**
 * (semantics)
 */

import { __shell } from "../../../main";
import type { ParserResults } from "./__typing";
import type { Tokens } from "./__typing"
import { VariableDoesNotExistsError } from "../components/__errors";
import { SPACE } from "./shell";
import { VariableValueIsMultipleWords } from "./__errors";


export const varNameRegex = /\$([^\s]+)/
// export const escapedVariableRegex = /(?<!\\)\$(.*\b)/g
export const escapeRegex = /\\([^\s])/g



/**
 * Parser function
 * Does three things
 * 0.Checks if the command was a variable assingment ? First three tokens are checked to be [$varName, = , singleTokenValue].
 * 1.Inserts values to all unescaped variables
 * 2.Escapes all backslash escaped characters
 * 3.Returns the name of primary command and all tokens if the command is not a variable assignment
 */
export function parse(tokens: Tokens): ParserResults {

    // variable assingment check
    if (isVariableAssignment(tokens)) {
        if (tokens.length > 3) throw new VariableValueIsMultipleWords(""); //multi word values to be enclosed in quotations

        // if the third token is also a variable
        // $a = $b -> where $b is a defined variable
        tokens[2] = insertVar(tokens[2]);
        return {
            type: "variable-assignment",
            tokens: tokens
        }
    }

    // variable insertions
    tokens = tokens.map(insertVar)


    // escaping backslash characters (un-nessasary for anything other than escacaping $ signs)
    tokens = tokens.map(token => token.replace(escapeRegex, "$1"))
    
    // since a command can either be a variable assingment or command call
    return {
        type: "command",
        command: tokens[0].trim(),
        tokens: tokens.slice(1)
    };
}

// 


function insertVar(token: string) {
    //TODO: Prolly Optimize since time complexity is o(n^2)
    const toks = token.split(SPACE).filter(Boolean);

    for (let i = 0; i < toks.length; i++) {
        toks[i] = toks[i].replace(varNameRegex, (_, name) => {
            const value = __shell.globals.vars.get(name);
            if (value === undefined) throw new VariableDoesNotExistsError(name, name)
            return value;
        })
    }

    return toks.join(SPACE);
}

function isVariableAssignment(tokens: Tokens): boolean {
    const _namePrefixTokMatch = Boolean(varNameRegex.exec(tokens[0]));
    const _equalsTokMatch = Boolean(/\=/.exec(tokens[1]))
    return _namePrefixTokMatch && _equalsTokMatch;
}
// 