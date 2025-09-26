export type NodeType = "file" | "directory"
export type FSNode = FileNode | DirectoryNode

export interface DirectoryNode {
    type: NodeType,
    name: string
    parent: DirectoryNode | null,
    children: Array<FSNode>,
}

export interface FileNode {
    type: NodeType,
    name: string,
    parent: DirectoryNode,
    content: string
}

export interface IFsFactoryConfig{
    /**
     * Initial file directory
     */
    initialStructure:DirectoryNode;

    /**
     * Initial directory path, starts at '/' if none specified
     */
    initialDirectory?:string;
}