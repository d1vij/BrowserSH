import { terminalInputFeild } from "../../domElements";

export class UserInputHandler{
    public static getUserInput(as: "string"|"array"="string"){
        const _userInput = terminalInputFeild.innerText;
        if(as=="string"){
            return _userInput;
        }
        return _userInput.split(' ');
    }
    
    public static clearUserInput(){
        terminalInputFeild.innerText = "";
        return
    }
}


