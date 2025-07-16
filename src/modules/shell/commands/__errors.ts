export class CommandDoesNotExistsError extends Error {
    constructor(message: string) {
        super(`CommandDoesNotExistsError: ${message}`);
        this.name = 'CommandDoesNotExistsError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InvalidFlagError extends Error {
    public flagName: string;
    constructor(flag: string) {
        super(`InvalidFlagError: ${flag}`);
        this.name = 'InvalidFlagError';
        this.flagName = flag;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class InvalidOptionError extends Error {
    public optionName: string;
    constructor(optionName: string) {
        super(`InvalidOptionError: ${optionName}`);
        this.optionName = optionName;
        this.name = 'InvalidOptionError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InvalidColorError extends Error {
    public color: string;
    constructor(color: string) {
        super(`InvalidColorError: ${color}`);

        this.color = color;
        this.name = 'InvalidColorError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

// math
export class InvalidOperationError extends Error {
    public operation;
    constructor(op: string) {
        super(`InvalidOperationError: ${op}`);
        this.operation = op
        this.name = 'InvalidOperationError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class InvalidNumberError extends Error {
    public num;
    constructor(num: string) {
        super(`InvalidNumberError: ${num}`);
        this.num = num;
        this.name = 'InvalidNumberError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class IncorrectArgumentsCountError extends Error {
    public expected;
    public got;
    constructor(expected:string | number, got: string | number) {
        super();
        this.expected = expected;
        this.got = got;
        this.name = 'IncorrectArgumentsCount';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

//fs
export class NodeNotFoundError extends Error {
    public path: string;
    constructor(path: string) {
        super(`NodeNotFoundError: ${path}`);
        this.path = path;
        this.name = 'NodeNotFoundError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

//list
export class InvalidListableItemError extends Error {
    public itemName;
    constructor(itemNamePassed: string) {
        super(`InvalidListItemError: ${ itemNamePassed }`);
        this.itemName = itemNamePassed;
        this.name = 'InvalidListItemError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

//run
export class FunctionNotFoundError extends Error {
    public funcname;
    constructor(name: string) {
        super(`FunctionNotFoundError: ${ name }`);
        this.name = 'FunctionNotFoundError';
        this.funcname = name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}