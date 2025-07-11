// core file system logic, implemented using nested linked lists orabstract data tree

import type {
    DirectoryNode,
    FileNode,
    FSNode
} from "./typing";
import {
    NodeIsDirectoryError,
    NodeIsFileError,
    NodeWithSameNameExistsError
} from "./errors";


function nodeNamesFrom(path: string): Array<string> {
    return path.split("/").filter(Boolean); //only have non empty node names
}


export class FileSystem {
    /**
     * Creates and appends a new DirectoryNode Object in parent's child nodes. Returns reference object to the created object
     * Throws error if node with same name (case sensistive) exists in current directory, pass overwrite=true to enable forced overwriting
     */
    public static createEmptyDirectory(parent: DirectoryNode, name: string, overwrite: boolean = false): DirectoryNode {
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
    public static traverse(root: DirectoryNode, maxDepth = Infinity, __depth = 0, __output: string = ""): string {
        // TODO: add output format ? string or array
        return __traverse(root, maxDepth, __depth, __output);
    }

    public static getNodeByPath(path: string, root: DirectoryNode): FSNode | undefined {
        const nodeNames = nodeNamesFrom(path);
        return __getNodeByPath(nodeNames, root);
    }

}

function __traverse(root: DirectoryNode, maxDepth: number, __depth = 0, __output = "") {

    // checking if current depth doesnt exceed maximum depth
    if (__depth > maxDepth) return __output;

    if (root.type === "file") throw new NodeIsDirectoryError(`${root.name} is a file`);

    const indent = '\n' + "  ".repeat(__depth);

    for (const node of root.children) {
        if (node.type === "directory") {
            __output += indent + node.name;
            return __traverse(node as DirectoryNode, maxDepth, ++__depth, __output);

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
