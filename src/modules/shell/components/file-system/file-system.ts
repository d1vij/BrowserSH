// core file system logic, implemented using nested linked lists orabstract data tree

import type {
    DirectoryNode,
    FileNode,
    FSNode
} from "../__typing";
import {
    NodeIsDirectoryError,
    NodeIsFileError,
    NodeWithSameNameExistsError
} from "../__errors";

function nodeNamesFrom(path: string): Array<string> {
    return path.split("/").filter(Boolean); //only have non empty node names
}


export class FileSystem {
    // NON-INSTANTIABLE
    /**
     * Creates and appends a new DirectoryNode Object in parent's child nodes. Returns reference object to the created object
     * Throws error if node with same name (case sensistive) exists in current directory, pass overwrite=true to enable forced overwriting
     */
    public static createDirectory(parent: DirectoryNode, name: string, overwrite: boolean = false): DirectoryNode {
        if (parent.type == "file") throw new NodeIsFileError(`${parent.name} is a file`);

        const nodeExists = parent.children.some(node => node.name === name);
        if (nodeExists && overwrite == false) throw new NodeWithSameNameExistsError(name);

        const _dir = {
            name,
            parent,
            type: "directory",
            children: []
        } as DirectoryNode

        parent.children.push(_dir);
        
        return _dir;
    }

    /**
     * Creates nested directories based on given path and parent
     */
    public static createDirectoryByPath(path:string, parent:DirectoryNode, overwrite = false): DirectoryNode{
        const directoryNames = path.split("/").filter(Boolean);
        console.log(directoryNames)
        // FIXME: add overwrtie
        // checking if any of node from provided path exists ??
        // let curr = parent.children.find(node => (node.name == directoryNames[0] && node.type == "directory")) as DirectoryNode | undefined
        // for(const name in directoryNames){
        //     if(curr === undefined) break;
        //     curr = curr?.children.find(node => node.name == name && node.type == "directory") as DirectoryNode;
        // }
        overwrite = !overwrite;
        let pre = parent;
        for(const name of    directoryNames){
            // TODO: add error handling
            pre = this.createDirectory(pre,name);
        }

        return pre;
    }
    
    

    /**
     * Creates and appends a new FileNode Object in parent's child nodes. Returns reference object to the created object
     * Throws error if node with same name (case sensistive) exists in current directory, pass overwrite=true to enable forced overwriting
     */
    public static createFile(parent: DirectoryNode, name: string, content: string = "", overwrite = false): FileNode {
        if (parent.type == "file") throw new NodeIsFileError(`${parent.name} is a file`);

        const nodeExists = parent.children.some(node => node.name === name)
        if (nodeExists && overwrite == false) throw new NodeWithSameNameExistsError(name);

        const _file = {
            name,
            parent,
            content,
            type: "file"
        } as FileNode
        parent.children.push(_file);
        return _file;
    }

    /**
     * Traverses and returns indent-formatted tree-like string of all nodes within a root node
     */
    public static traverseAndList(root: DirectoryNode, maxDepth = Infinity, __depth = 0, __output: string = ""): string {
        // TODO: add output format ? string or array
        return root.name + __traverse(root, maxDepth, __depth, __output);
    }

    public static getNodeByPath(path: string, root: DirectoryNode): FSNode | undefined {
        const nodeNames = nodeNamesFrom(path);
        return __getNodeByPath(nodeNames, root);
    }

    public static getPathFromNode(node:FSNode): string{
        const __path = []
        let curr:FSNode | null = node ;
        
        while(curr!=null){
            __path.push(curr.name.trim());
            curr = curr?.parent;
        }
        
        return __path
                    .reverse()
                    .filter(Boolean)
                    .join("/");
    }
    
}

function __traverse(root: DirectoryNode, maxDepth: number, __depth = 0, __output = "") {
    // checking if current depth doesnt exceed maximum depth
    if (__depth > maxDepth) return __output;

    if (root.type === "file") throw new NodeIsDirectoryError(`${root.name} is a file`);
    
    const indent = '\n ' + "|  ".repeat(__depth) + '|-- ';
    
    for (const node of root.children) {
        if (node.type === "directory") {
            __output += indent + node.name;
            __output = __traverse(node as DirectoryNode, maxDepth, __depth + 1, __output);
            
        } else {
            __output += indent + node.name;
        }
    }
    
    return __output;
}

function __getNodeByPath(nodeNames: Array<string>, root: DirectoryNode): FSNode | undefined {
    let current: DirectoryNode = root;

    for (let part of nodeNames) {
        if (current.type === "file") undefined;

        const next = current.children.find(node => node.name === part); //is case sensitive
        if (!next) return undefined;

        // @ts-ignore
        // FIXME: collision bw fsnode and direcotoryNode types
        current = next;
    }

    return current;
}
