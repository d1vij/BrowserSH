
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

export type Ttokens = Array<string>

export type TQuote = '"' | "'"
