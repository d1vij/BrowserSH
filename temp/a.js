function startsWithQuote(str) {
    return /(?<!\\)^[\'\"]/.test(str);
}

function containsUnescapedQuoteInMiddle(str) {
    for (let i = 1; i < str.length - 1; i++) {
        const char = str[i];
        const prev = str[i - 1];

        if ((char === '"' || char === "'") && prev !== '\\') {
            return true;
        }
    }
    return false;
}

function endsWithQuote(str) {
    return /(?<!\\)[\'\"]$/.test(str);
}

export function tokenize(command) {
    let currentToken = '';
    let lastSeenQuote = undefined;
    let allQuotesPaired = true;

    let processedTokenStack = [];
    let currentTokenStack = [];

    if (startsWithQuote(command)) {
        throw new CommandStartsWithQuotesError(command);
    }

    const tokens = command.split(' ').filter(Boolean);

    for (let index = 0; index < tokens.length; index++) {
        currentToken = tokens[index];

        if (lastSeenQuote === undefined && containsUnescapedQuoteInMiddle(currentToken)) {
            throw new TokenContainsQuoteInMiddleErrror(currentToken);
        }

        if (lastSeenQuote === undefined && allQuotesPaired === true && startsWithQuote(currentToken)) {
            lastSeenQuote = currentToken[0];
            allQuotesPaired = false;
            currentTokenStack.push(currentToken.slice(1));
        } else if (
            lastSeenQuote !== undefined &&
            allQuotesPaired === false &&
            endsWithQuote(currentToken) &&
            currentToken.endsWith(lastSeenQuote)
        ) {
            lastSeenQuote = undefined;
            allQuotesPaired = true;
            currentTokenStack.push(currentToken.slice(0, -1));
            processedTokenStack.push(currentTokenStack.join(' '));
            currentTokenStack = [];
        } else if (lastSeenQuote !== undefined && allQuotesPaired === false) {
            currentTokenStack.push(currentToken);
        } else {
            processedTokenStack.push(currentToken);
        }
    }

    if (allQuotesPaired === false) {
        throw new CommandContainsUnpairedQuoteError(command);
    }

    return processedTokenStack;
}

export class CommandStartsWithQuotesError extends Error {
    constructor(message) {
        super(`CommandStartsWithQuotesError: ${message}`);
        this.name = 'CommandStartsWithQuotesError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class TokenContainsQuoteInMiddleErrror extends Error {
    constructor(message) {
        super(`TokenContainsQuoteInMiddleErrror: ${message}`);
        this.name = 'TokenContainsQuoteInMiddleErrror';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class CommandContainsUnpairedQuoteError extends Error {
    constructor(message) {
        super(`CommandContainsUnpairedQuoteError: ${message}`);
        this.name = 'CommandContainsUnpairedQuoteError';
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
