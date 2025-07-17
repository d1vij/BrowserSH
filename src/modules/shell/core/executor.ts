import { __shell } from "../../../main";
import type { Tokens , ParserResults} from "./__typing";
import { varNameRegex} from "./parser";
import { UndefinedCommandError, UnexpectedError } from "./__errors";
import { getCommandConstructor } from "../commands/command-index";
import type { MaybeAsyncFunction } from "../commands/__typing";

/**
 * Executor Function
 * Executes whatever is passed from parser results
 * Recieves results object and a "done" callback function. This function gets executed when the execution is finishied
 */
export function execute(results: ParserResults, done? : MaybeAsyncFunction<void>){
    if(results.type=="variable-assignment" && results.tokens){
        console.log("va ")
        assignVariable(results.tokens);
        done?.();
        return;
    }
    else if (results.type=="command" && results.command && results.tokens){
        // fetching the class of command
        // NOTE: The names of command are case-sensitive
        const cmdConstruct = getCommandConstructor(results.command)
        
        // no command found with provided name
        if(cmdConstruct === undefined) throw new UndefinedCommandError(results.command);
        
        const instance = new cmdConstruct();
        instance.execute(results.tokens, done);
        return;

    } else{
        throw new UnexpectedError(results.toString());
    }
}

// 

function assignVariable(tokens: Tokens) {
    const name = varNameRegex.exec(tokens[0])![1]
    const value = tokens[2]
    __shell.globals.vars.set(name, value);
    return;
}