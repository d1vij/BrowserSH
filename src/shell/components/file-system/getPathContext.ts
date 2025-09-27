import { SHELL } from "../../../main";
import type { DirectoryNode } from "../__typing"
import { HOME_IDENTIFIER, nodeNamesFrom, PARENT_IDENTIFIER, SELF_IDENTIFIER } from "./file-system-core";
import { NodeNotFoundError } from "../../commands/errors";
import type { PathContext } from "../../commands/typings";
import { FileSystem } from "./file-system-core";


export function getPathContext(path: string, directoryNode: DirectoryNode): PathContext {
    // returns correct parent node and array of path names when provided with a path and directory node context

    const path_toks = nodeNamesFrom(path);
    if (path_toks[0] === PARENT_IDENTIFIER) {
        // path starts relative to current directories' parent

        const parent = directoryNode.parent
        if (parent === null) throw new NodeNotFoundError("parent");
        path_toks.splice(0, 1);
        return {
            root: parent,
            path: path_toks
        }
    }
    else if (path[0] === SELF_IDENTIFIER) {
        path_toks.splice(0, 1);
        return {
            root: directoryNode,
            path: path_toks
        }
    }
    else if(path_toks[0] == HOME_IDENTIFIER){
        const home = FileSystem.getNodeByPath("/home/", SHELL.globals.fs.root) as DirectoryNode;
        if(home === undefined) throw new Error("Home directory is not defined!");
        path_toks.splice(0,1 );
        return {
            root: home,
            path: path_toks
        }
    }
    else if (path.startsWith(SHELL.globals.fs.root.name)) {
        path_toks.splice(0, 1);
        return {
            root: SHELL.globals.fs.root,
            path: path_toks
        }
    }
    else {
        return {
            root: directoryNode,
            path: path_toks
        }
    }
}