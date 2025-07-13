import { InvalidFlagError, InvalidOptionError } from "./__errors";

export function processGenericErrors(err:InvalidFlagError | InvalidOptionError){
    // processing 
    if(err instanceof InvalidFlagError){

    } else if(err instanceof InvalidOptionError){
        
    }
}