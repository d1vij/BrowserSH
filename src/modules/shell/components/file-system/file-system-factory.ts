import type { DirectoryNode, IFsFactoryConfig } from "../__typing";


/**
 * Factory class to generate a FileSystem Object, which stores "file system" and other attributes. This is publicly exposed class to store fs data
 */
export class FileSystemFactory {
    /**
     * The root node
     */
    public filesystem: DirectoryNode;
    public currentDirectory: string;

    constructor(config: IFsFactoryConfig) {
        /**
         * Ideally the initial fs structure should be
            {
                type: "directory",
                name: "/",
                parent: null,
                children: []
            } 
        */
           this.filesystem = config.initialStructure

           
           this.currentDirectory = config.initialDirectory || "/";
        }
}