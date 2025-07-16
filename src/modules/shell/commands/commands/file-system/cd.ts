import { __shell } from "../../../../../main";
import { addColor } from "../../../../output-handler/formatter";
import { TerminalOutputHandler } from "../../../../output-handler/terminal-output-handler";
import { Colors } from "../../../../output-handler/typing/enums";
import { NodeIsFileError } from "../../../components/__errors";
import type { DirectoryNode } from "../../../components/__typing";
import { FileSystem } from "../../../components/file-system/file-system";
import type { Tokens } from "../../../core/__typing";
import { getCommandContext } from "../../../core/extract";
import { IncorrectArgumentsCountError, NodeNotFoundError } from "../../__errors";
import { AbstractCommand } from "../../AbstractCommand";
import { getPathContext } from "../../../components/file-system/getPathContext";

export class Cd extends AbstractCommand{
    public name: string = "cd";
    public flags: string[] = [];
    public options: string[] = [];

    protected __execute(tokens:Tokens){
        const results = getCommandContext(tokens);
        if(results.remainingTokens.length != 1) throw new IncorrectArgumentsCountError(1, results.remainingTokens.length);

        const path = results.remainingTokens[0];
        const context = getPathContext(path, __shell.globals.fs.currentDirectoryNode);

        const node = FileSystem.getNodeByPath(context);
        if(node === undefined) throw new NodeNotFoundError(path);
        else if (node.type === "file") throw new NodeIsFileError(path);

        __shell.globals.fs.currentDirectoryNode = node as DirectoryNode;
        return;
    }
    
    
    public handleErrors(err: any): void {
        if(err instanceof IncorrectArgumentsCountError){
            TerminalOutputHandler.standardErrorOutput([
                `IncorrectArgumentsCountError: This command only takes one argument!`,
                `Pass any paths with spaces inside quotations!`
            ])
            return;

        } else if(err instanceof NodeNotFoundError){
            if(err.path==="parent"){
                TerminalOutputHandler.standardErrorOutput([
                    `NodeNotFoundError: No parent node exists for this directory !.`,
                    `Current directory could be the root directory ??`
                ])
                return;
            }
            TerminalOutputHandler.standardErrorOutput([
                `NodeNotFoundError: Cannot cd into directory, ${addColor(err.path, Colors.yellow_light)}, no such path exists!`
            ])
            return;
            
        } else if(err instanceof NodeIsFileError){
            TerminalOutputHandler.standardErrorOutput([
                `NodeIsFileError: Cannot cd to path, ${addColor(err.path, Colors.yellow_light)}, target node is a File!`
            ])
            return;
        }
        else{
            TerminalOutputHandler.standardErrorOutput([
                `INVALIDERROR: ${err.name}`,
                err.toString() //idk if it would work or not
            ])
            return;
        }
    }
    public info(): string[] {
        return [
            "change the current working directory"
        ];
    }

    public usage(): string[] {
        return [
            "usage: cd <path>",
            "",
            "Arguments:",
            "\t<path> -> Path to the target directory. Can be relative, absolute, or special symbols ('.' or '..')",
            "",
            "Path formats supported:",
            `\t ${addColor(".", Colors.yellow_light)} -> Refers to the current directory`,
            `\t ${addColor("..", Colors.yellow_light)} -> Refers to the parent directory`,
            `\t ${addColor("root/path/to/dir", Colors.yellow_light)} -> Absolute path starting from root directory`,
            `\t ${addColor("some/nested/dir", Colors.yellow_light)}-> Relative path from current directory`,
            "",
            "Examples:",
            `\t ${addColor("cd .. ",Colors.blue_light)} => Moves to the parent directory`,
            `\t ${addColor("cd . ",Colors.blue_light)} => Stays in the current directory`,
            `\t ${addColor("cd ./ ",Colors.blue_light)} => Stays in the current directory`,
            `\t ${addColor("cd root/Users/Guest ",Colors.blue_light)} => Moves to absolute path starting from root`,
            `\t ${addColor("cd ./root/a/b",Colors.blue_light)} => Moves to relative path starting from current directory`,
            `\t ${addColor("cd projects/alpha",Colors.blue_light)} => Moves into a subfolder called 'alpha' inside 'projects'`
        ];
    }

}