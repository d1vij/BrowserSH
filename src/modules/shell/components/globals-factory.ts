import { FileSystemFactory } from "./file-system/file-system-factory";
import { VariableSystemFactory } from "./variables-factory";

/**
 * GlobalsFactory instantiates a "Globals" object which acts as a pseudo environment for the shell / terminal.
 * All other similar environment factories are also instantiated here, making this class's instance a singleton for all the other components
 */
export class GlobalsFactory {
    public fs: FileSystemFactory;
    public vars: VariableSystemFactory;

    constructor() {

        // initial root directory is empty and its name is '#' (not bash like rawrrr)
        this.fs = new FileSystemFactory({
            initialStructure: {
                name:"#",
                type:"directory",
                parent: null,
                children:[],
            }
        });

        this.vars = new VariableSystemFactory();
    }
}