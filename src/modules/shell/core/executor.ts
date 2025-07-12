import { __shell } from "../../../main";
import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
import { OutputTemplates } from "../../output-handler/formatter";
import type { Tokens , parserResults} from "./__typing";
import { varNameRegex} from "./parser";
import { UndefinedCommandError, UnexpectedError, VariableValueIsMultipleWords } from "./__errors";
import { getCommandConstructor } from "../commands/command-index";


export function execute(results: parserResults){
    if(results.type=="variable-assignment" && results.tokens){
        assignVariable(results.tokens)
    }
    else if (results.type=="command" && results.command && results.tokens){
        const cmdConstruct = getCommandConstructor(results.command)
        
        if(cmdConstruct === undefined) throw new UndefinedCommandError(results.command);

        const instance = new cmdConstruct();
        instance.execute(results.tokens);
        return;

    } else{
        throw new UnexpectedError(results.toString());
    }
}



function assignVariable(tokens: Tokens) {
    if (tokens.length > 3) throw new VariableValueIsMultipleWords(tokens.toString()); //multi word values to be enclosed in quotations
    const name = varNameRegex.exec(tokens[0])![1]
    const value = tokens[2]
    __shell.globals.vars.set(name, value);
    
    TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput("variable set")); //empty line //TODO:prolly improve this
    return;
}