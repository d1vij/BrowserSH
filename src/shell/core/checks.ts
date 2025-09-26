export function test_isNumeric(str: string): boolean {
    // things that count as numbers -> 123 1.23 -123 -1.23 -0.23 0323
    // things that dont count as numbers -> .123 -.123 123. xyz

    return /^\-?\d+(?:\.?\d+$)?/.test(str);
}
export function test_isInteger(str:string, positive:boolean): boolean{
    if(positive) return /^\d+$/.test(str);
    else return /^\-?\d+$/.test(str);
}