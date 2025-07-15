import { __shell } from "../../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { NodeWithSameNameExistsError } from "../../../components/__errors";
import type { DirectoryNode } from "../../../components/__typing";
import { FileSystem, nodeNamesFrom, PARENT_IDENTIFIER, SELF_IDENTIFIER } from "../../../components/file-system/file-system";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { IncorrectArgumentsCountError, NodeNotFoundError } from "../../__errors";
import { AbstractCommand } from "../../AbstractCommand";

export class Mkdir extends AbstractCommand {
    public name: string = "mkdir";
    public flags: string[] = [];
    public options: string[] = [];
    public execute(tokens: Tokens): void {
        try {
            this.__execute(tokens);
        } catch (err) {
            this.handleErrors(err);
        }
    }
    public handleErrors(err: any): void {
        if (err instanceof IncorrectArgumentsCountError) {
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountError: This command only takes one argument!`,
                `Pass any paths with spaces inside quotations!`
            ])
            return;
        } if (err instanceof NodeWithSameNameExistsError){
            TerminalOutputHandler.standardErrorOutput([
                `NodeWithSameNameExistsError: A directory already exists at path ${addColor(err.path, Colors.yellow_light)}.`,
                `To overwrite existing directory, use the ${addColor('-f', Colors.blue_light)} flag.`
            ])
        }
    }

    private __execute(tokens: Tokens) {
        const results = getCommandContext(tokens);
        if (results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);
        const path = results.remainingTokens[0]

        // let path_toks = nodeNamesFrom(path);
        
        // let start_node;
        // if (path_toks[0] === PARENT_IDENTIFIER) {

        //     const parent = __shell.globals.fs.currentDirectoryNode.parent;
        //     if (parent === null) throw new NodeNotFoundError("parent");
        //     __shell.globals.fs.currentDirectoryNode = parent;
        //     start_node = parent;
        //     path_toks.splice(0, 1);
        // }
        // else if (path_toks[0] === SELF_IDENTIFIER) {
        //     path_toks.splice(0, 1);
        //     start_node = __shell.globals.fs.currentDirectoryNode;
        // }

        
        const foundNode = FileSystem.getNodeByPath(path,__shell.globals.fs.currentDirectoryNode);
        if(foundNode !== undefined) throw new NodeWithSameNameExistsError(path);

        let createdNode;
        if(results.flags.includes('f')){
            createdNode = FileSystem.createDirectoryByPath(path, __shell.globals.fs.currentDirectoryNode, true);
        }
        else{
            createdNode = FileSystem.createDirectoryByPath(path, __shell.globals.fs.currentDirectoryNode);
        }

        if(results.flags.includes('c') || results.flags.includes("cd")){
            __shell.globals.fs.currentDirectoryNode = createdNode;
        }
        return;
    }


}