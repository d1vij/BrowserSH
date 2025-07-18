

export type TCommand = string
export type TOption = string
export type TFlag = string;
export type TArgument = string;

export type TParsedCommand = {
    command: TCommand, //primary command name
    arguments: TArgument[],
    flags: TFlag[], //['f', 'b'] etc
    options: Record<TOption, string>// color: red, bold: true
}

export type Tokens = Array<string>

export type TQuote = '"' | "'"

export interface ParserResults {
    type: "command" | "variable-assignment"
    command?: string; //name of primary command
    tokens?: Tokens;
}

export interface ExtractionResults {
    flags: Array<TFlag>;
    options: Record<TOption, string>,
    remainingTokens: Tokens
}