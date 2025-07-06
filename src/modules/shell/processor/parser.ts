/**
 * (semantics)
 */

import { Global } from "../../../main";
import { OutputTemplates } from "../../output-handler/formatter";
import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
import type { Ttokens } from "./typing/types"

const unescapedVariableRegex = /(?<!\\)\$([\w\-]+)/g
const escapedVariableRegex = /(\\\$)(?:[\w\-])+/g

export class VariableValueLengthError extends Error {
  constructor(message: string) {
    super(`VariableValueLengthError: ${ message }`);
    this.name = 'VariableValueLengthError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}


function __variableAssignment(name:string, value:string){
   Global.vars.set(name, value);
   TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput("variable set")); //empty line //TODO:prolly improve this
}


export function parse(tokens:Ttokens){
   // check 1 - is command  a variable assignment?
   // eg $name = divij
   if(isVariableAssignment(tokens)){
      if(tokens.length > 3) throw new VariableValueLengthError(tokens.toString()); //multi word values to be enclosed in quotations
      __variableAssignment(unescapedVariableRegex.exec(tokens[0])![1], tokens[2]);
   } 
   for(let token in tokens){
      token.replace(escapedVariableRegex, "<escaped>$"); //TODO: change
   }
   
   
}
function isVariableAssignment(tokens:Ttokens):boolean {
   const _namePrefixTokMatch = Boolean(unescapedVariableRegex.exec(tokens[0]));
   const _equalsTokMatch = Boolean(/=/.exec(tokens[1]))
   return _namePrefixTokMatch && _equalsTokMatch;
}
