// core file system logic, implemented using nested linked lists orabstract data tree

import type {
    DirectoryNode,
    FileNode,
    FSNode
} from "../__typing";
import {
    NodeIsDirectoryError,
    NodeIsFileError,
    NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError,
    NodeWithSameNameExistsError
} from "../__errors";
import { NodeNotFoundError } from "../../commands/__errors";
import type { PathContext } from "../../commands/__typing";

export function nodeNamesFrom(path: string): Array<string> {
    return path.split("/").filter(Boolean); //only have non empty node names
}
export function pathFromNodeNames(nodeNames:string[]): string{
    return nodeNames.join('/');
}

export const PARENT_IDENTIFIER = "..";
export const SELF_IDENTIFIER = ".";


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
    public static createDirectoryByPath(path: PathContext, overwrite: boolean): DirectoryNode;
    public static createDirectoryByPath(path: string, parent: DirectoryNode, overwrite: boolean): DirectoryNode;

    public static createDirectoryByPath(path: string | PathContext,parentOrOverwrite: DirectoryNode | boolean,maybeOverwrite?: boolean): DirectoryNode {
        let temp: DirectoryNode;
        let directoryNames: string[];
        let overwrite: boolean;

        if (typeof path === "object" && "path" in path && "root" in path) {
            temp = path.root;
            directoryNames = path.path;
            overwrite = parentOrOverwrite as boolean;
        } else {
            temp = parentOrOverwrite as DirectoryNode;
            directoryNames = nodeNamesFrom(path as string);
            overwrite = maybeOverwrite!;
        }

        let existingsIndex: number;
        for (let i = 0; i < directoryNames.length; i++) {
            existingsIndex = temp.children.findIndex(
                node => node.name === directoryNames[i] && node.type === "directory"
            );

            if (existingsIndex !== -1) {
                if (!overwrite) {
                    throw new NodeWithSameNameExistsError(pathFromNodeNames(directoryNames.slice(0, i)));
                }

                temp.children.splice(existingsIndex, 1); // remove existing conflicting directory
            }

            temp = FileSystem.createDirectory(temp, directoryNames[i], overwrite);
        }

        return temp;
    }

    
    public static deleteNodeByPath(path:string, root:DirectoryNode, recurse: boolean = false){
        const node = this.getNodeByPath(path, root);
        if(node === undefined) throw new NodeNotFoundError(path);

        if(node.type === "directory" && recurse == false) throw new NodeToRemoveIsADirectoryAndNoRecurseFlagIsProvidedError(path);
        if(node.parent == null) throw new NodeNotFoundError("parent");

        const parent = node.parent;
        const nodeIndex = parent.children.findIndex(n => n.name === node.name);
        parent.children.splice(nodeIndex, 1);
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

    public static traverseAndList(context: PathContext, maxDepth: number):string[];
    public static traverseAndList(root: DirectoryNode, maxDepth: number):string[];
    public static traverseAndList(dir: DirectoryNode | PathContext,maxDepth = Infinity):string[] {
        if(typeof dir === "object" && "root" in dir && "path" in dir){
            return [dir.root.name, ...__traverse(dir.root, maxDepth, 0, [])];
        }
        return [dir.name, ...__traverse(dir, maxDepth, 0, [])];
    }

    public static getNodeByPath(path: PathContext): FSNode | undefined;
    public static getNodeByPath(path: Array<string>, root: DirectoryNode): FSNode | undefined;
    public static getNodeByPath(path: string, root: DirectoryNode): FSNode | undefined;
    public static getNodeByPath(path: string | Array<string> | PathContext, root?: DirectoryNode): FSNode | undefined {

        let nodeNames: string[];
        let _root: DirectoryNode;

        if (typeof path === "object" && "path" in path && "root" in path) {
            nodeNames = Array.isArray(path.path) ? path.path : nodeNamesFrom(path.path);
            _root = path.root;
            
        } else if (Array.isArray(path)) {
            nodeNames = path;
            _root = root!;
            
        } else {
            nodeNames = nodeNamesFrom(path);
            _root = root!;
        }

        return __getNodeByPath(nodeNames, _root);
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

function __traverse(root: DirectoryNode, maxDepth: number, __depth = 0, __output: Array<string>) {
    // checking if current depth doesnt exceed maximum depth
    if (__depth >= maxDepth) return __output;

    if (root.type === "file") throw new NodeIsDirectoryError(`${root.name} is a file`);
    
    const indent = "|  ".repeat(__depth) + '|-- ';
    
    for (const node of root.children) {
        if (node.type === "directory") {
            __output.push(indent + node.name);
            __output = __traverse(node as DirectoryNode, maxDepth, __depth + 1, __output);
            
        } else {
            __output.push(indent + node.name);
        }
    }
    
    return __output;
}

function __getNodeByPath(nodeNames: Array<string>, root: DirectoryNode): FSNode | undefined {
    
    let current: DirectoryNode = root;
    let next;
    for (let part of nodeNames) {
        if (current.type === "file") return undefined;
        if(part === PARENT_IDENTIFIER){
            // cd into parent
            next = current.parent;
        }
        else if(part === SELF_IDENTIFIER){
            // unintuitive but yeah
            next = current;
        } else{
            next = current.children.find(node => node.name === part); //is case sensitive
        }

        if (!next) return undefined;

        // @ts-ignore
        // FIXME: collision bw fsnode and direcotoryNode types
        current = next;
    }

    return current;
}
