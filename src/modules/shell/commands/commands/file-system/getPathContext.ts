import { __shell } from "../../../../../main";
import type { DirectoryNode } from "../../../components/__typing"
import { nodeNamesFrom, PARENT_IDENTIFIER, SELF_IDENTIFIER } from "../../../components/file-system/file-system";
import { NodeNotFoundError } from "../../__errors";
import type { PathContext } from "../../__typing";



export function getPathContext(path:string, directoryNode:DirectoryNode): PathContext{
    // returns correct parent node and array of path names when provided with a path and directory node context

    const path_toks = nodeNamesFrom(path);
    if(path_toks[0] === PARENT_IDENTIFIER){
        // path starts relative to current directories' parent

        const parent = directoryNode.parent
        if(parent === null) throw new NodeNotFoundError("parent");
        path_toks.splice(0,1);
        return {
            root: parent,
            path: path_toks
        }
    }
    else if(path[0] === SELF_IDENTIFIER){
        path_toks.splice(0,1);
        return {
            root: directoryNode,
            path: path_toks
        }
    }
    else if(path.startsWith(__shell.globals.fs.root.name)){
        path_toks.splice(0,1);
        return {
            root: __shell.globals.fs.root,
            path: path_toks
        }
    }
    else{
        return {
            root: directoryNode,
            path: path_toks
        }
    }
}