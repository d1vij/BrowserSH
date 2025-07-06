import type { DirectoryNode, IFsFactoryConfig } from "./typing";


/**
 * Factory class to generate a FileSystem Object, which stores "file system" and other attributes. This is publicly exposed class to store fs data
 */
export class FileSystemFactory{
    public filesystem: DirectoryNode;
    public currentDirectory: string;

    constructor(config:IFsFactoryConfig){
        this.filesystem = config.initialStructure
        this.currentDirectory = config.initialDirectory || "/";
    }
}