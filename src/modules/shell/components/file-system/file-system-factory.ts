import type { DirectoryNode, IFsFactoryConfig } from "../__typing";


/**
 * Factory class to generate a FileSystem Object, which stores "file system" and other attributes. This is publicly exposed class to store fs data
 */
export class FileSystemFactory {
    /**
     * The root node
     */
    public root: DirectoryNode;

    public currentDirectoryNode: DirectoryNode;
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
           this.root = config.initialStructure
           this.currentDirectoryNode = this.root;
        }
}