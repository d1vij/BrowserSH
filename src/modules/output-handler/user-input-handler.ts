import { terminalInputFeild } from "../../domElements";

export class UserInputHandler{
    public static getUserInput(){
        return terminalInputFeild.innerText;
    }
    
    public static clearUserInput(){
        terminalInputFeild.innerText = "";
        return
    }
}


