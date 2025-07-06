// export and instantiate globals only from here

/**
 * Pseudo "global" storage or environment system
 */
import { FileSystemFactory } from "./file-system/file-system-factory";
import { UserFactory } from "./user-factory";
import { VariableSystemFactory } from "./variables-factory";

export class GlobalsFactory {
    public fs: FileSystemFactory;
    public vars: VariableSystemFactory;
    public user: UserFactory;

    constructor() {
        this.fs = new FileSystemFactory({
            initialStructure: {
                name:"/",
                type:"directory",
                parent: null,
                children:[],
            },
            initialDirectory:"/"
        });

        // TODO: Add modifiable user initialization here vvv
        this.user = new UserFactory("divij");
        this.vars = new VariableSystemFactory({"ping":"pong"});
    }
}