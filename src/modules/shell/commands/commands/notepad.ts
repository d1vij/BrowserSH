import { __shell } from "../../../../main";
import { NotepadFactory } from "../../../ui/notepad";
import { NodeIsDirectoryError, NodeWithSameNameExistsError } from "../../components/__errors";
import type { DirectoryNode, FileNode } from "../../components/__typing";
import { FileSystem } from "../../components/file-system/file-system";
import { getPathContext } from "../../components/file-system/getPathContext";
import type { Tokens } from "../../core/__typing";
import { getCommandContext } from "../../core/extract";
import { InvalidFlagError, InvalidOptionError, NodeNotFoundError } from "../__errors";
import { AbstractCommand } from "../AbstractCommand";


export class Notepad extends AbstractCommand{ 
    public name = "notepad";
    public options: string[] = ['o', "open", 'n', "new"];
    
    protected async __execute(tokens: Tokens): Promise<void> {
        const results = getCommandContext(tokens);
        const optKeys = Object.keys(results.options);
        if(optKeys.includes('o') || optKeys.includes("open")){
            const path = results.options["o"] || results.options["open"] || undefined;
            if(path===undefined) throw new InvalidOptionError("open");
            let node = FileSystem.getNodeByPath(getPathContext(path, __shell.globals.fs.currentDirectoryNode));
            
            if(node === undefined) throw new NodeNotFoundError(path);
            if(node.type === "directory") throw new NodeIsDirectoryError(path);

            node = node as FileNode;
            
            const existingContent = node.content || "";
            const name = node.name;
            const npd = new NotepadFactory(existingContent, name);
            const content = await npd.getInput();
            node.content = content;
            return;

        } else if(optKeys.includes('n') || optKeys.includes("new")){
            const path = results.options['n'] || results.options["new"] || undefined;
            if(path === undefined) throw new InvalidOptionError("new");

            const node = FileSystem.getNodeByPath(getPathContext(path, __shell.globals.fs.currentDirectoryNode));
            if(node !== undefined) throw new NodeWithSameNameExistsError(path);

            const createdNode = FileSystem.createFileByPath
            const npd = new NotepadFactory("", )
            
            
        } else {
            throw new InvalidFlagError("");
        }
    }
}