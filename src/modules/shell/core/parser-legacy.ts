/**
 * (semantics)
 */



import type { TParsedCommand } from "./typing/types.ts";
import type { TArgument, TCommand, TOption, TFlag } from "./typing/types.ts";

const commandRegex = /^(\w+)/
const argumentsRegex = /^\s*\w+\s((?:[^\-^\n]*)?)/
const optionsRegex = /--(\w+) ([^-]+)/g 
const singleLetterflagsRegex = /(?:^|\s)-([a-zA-Z])/g;
const multiLetterFlagRegex = /\s--([a-zA-Z]+)(?!\s?\w+)/g

export function parseCommand(rawCommand: string):TParsedCommand {
    rawCommand = rawCommand.trim();
    const command = (commandRegex
                        .exec(rawCommand)?.[1] 
                        .trim() || null) as TCommand;
                        
    const argsArray= (argumentsRegex
                    .exec(rawCommand)?.[1]
                    .trim()
                    .split(' ')
                    .map(a => a.trim()) || []) as TArgument[];


    const flags = [] as TFlag[];
    let foundFlag;
    
    while((foundFlag = singleLetterflagsRegex.exec(rawCommand)) != null){
        flags.push(foundFlag[1]);
    }
    while((foundFlag = multiLetterFlagRegex.exec(rawCommand)) != null){
        flags.push(foundFlag[1]);
    }

    const options = {} as Record<TOption, string>
    let foundOption;
    while(foundOption = optionsRegex.exec(rawCommand)){
        options[foundOption[1]] = foundOption[2].trim();    
    }
    
    return {
        command,
        arguments: argsArray,
        flags: flags,
        options
    } as TParsedCommand
}