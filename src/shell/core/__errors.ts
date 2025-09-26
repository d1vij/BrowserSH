
// executor
export class VariableValueIsMultipleWords extends Error {
    constructor(message: string) {
        super(`VariableValueLengthError: ${message}`);
        this.name = 'VariableValueLengthError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

//tokenizer
export class CommandStartsWithQuotesError extends Error {
    constructor(message: string) {
        super(`CommandStartsWithQuotesError: ${message}`);
        this.name = 'CommandStartsWithQuotesError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class TokenContainsQuoteInMiddleErrror extends Error {
    constructor(message: string) {
        super(`TokenContainsQuoteInMiddleErrror: ${message}`);
        this.name = 'TokenContainsQuoteInMiddleErrror';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class CommandContainsUnpairedQuoteError extends Error {
    constructor(message: string) {
        super(`CommandContainsUnpairedQuoteError: ${message}`);
        this.name = 'CommandContainsUnpairedQuoteError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

//executor

export class UnexpectedError extends Error {
    constructor(message: string) {
        super(`UnexpectedError: ${message}`);
        this.name = 'UnexpectedError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class UndefinedCommandError extends Error {
    command: string;
    constructor(command: string) {
        super(`UndefinedCommandError: ${command}`);
        this.name = 'UndefinedCommandError';
        this.command = command;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}