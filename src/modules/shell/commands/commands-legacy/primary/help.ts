import { addColor, OutputTemplates, stringify } from "../../output-handler/formatter";
import { TerminalOutputHandler } from "../../output-handler/terminal-output-handler";
import { Colors } from "../../output-handler/typing/enums";
import type { TParsedCommand } from "../../shell/typing/types";
import { GenericError } from "../errors";
import { KnownCommands } from "../known-commands";

// TODO: fix usage and info printing, issue is probably in stringify function
// FIXME: Remove printing of null command

export class Help {
    public static primary = "help";
    public static flags = ['usage','u'];
    public static options = [];
    public static subcommands = [];
    
    public static execute(parsed:TParsedCommand){
        // primary command to get help on is the first and only argument
        if (parsed.arguments.length > 1) {
            new GenericError(stringify([
                `${addColor("help", Colors.blue_cool)} only zero or more arguments can be passed`,
                `arguments found: [${parsed.arguments.join(', ')}]`
            ]))
            return;
        } else if(parsed.arguments.length == 0){
            // list all commands
            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(stringify(Object.keys(KnownCommands))));
            return;
        }
        

        const cmd = KnownCommands[parsed.arguments[0]];
        if(cmd == undefined){
            return;
        }
        
        if(parsed.flags.some(f =>this.flags.includes(f)) == true){
            // show usage of command
            
            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(cmd.usage()))
            return;
        } else {
            // show info about command

            TerminalOutputHandler.printToTerminal(OutputTemplates.standardTerminalOutput(cmd.info()))
            
        }
    }
    public static info(){
        return stringify([
            "Display information about builtin commands, or used to list all avaialable commands",
            "Options",
            "\t--usage | -u\t Shows usage info for provided command ",
        ])
    }
    public static usage(){
        return stringify([
            "help [COMMAND_NAME] [-u | --usage]",
            "eg help echo -> info for echo",
            "\thelp echo --usage -> usage for echo",
            "\thelp -> lists all avaialable commands",

        ])
    }
    
}