import { terminalInputFeild } from "../dom-elements";

export class UserInputHandler{
    public static getUserInput(){
        return terminalInputFeild.innerText.trim();
    }
    
    public static clearUserInput(){
        terminalInputFeild.innerText = "";
        return
    }
    public static setUserInput(text:string){
        terminalInputFeild.innerText = text;
        return;
    }
    
}


