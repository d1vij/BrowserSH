// Emulating BASH like command history


export class CommandHistory {
    private history: string[];
    private currentPosition: number;
    constructor(){
        this.history = []    
        this.currentPosition = 0;
    }

    /**
     * [
     *  echo hello,
     *  help
     * ]
     */

    public getAt(idx: number){
        return this.history.at(idx);
    }
    public append(cmd: string){
        if(cmd === "") return;
        if(cmd === this.getAt(-1)) return; //dont save same commands
        this.history.push(cmd);
    }

    public resetPosition(){
        this.currentPosition = (this.history.length);
    }
    public getPrevious(){
        if(this.currentPosition <= 0){  
            return this.history[0] || "";
        }
        else {
            this.currentPosition -= 1;
            return this.history[this.currentPosition];
        }
    }
    public getNext(){
        if(this.currentPosition >= this.history.length -1){
            return this.history[this.history.length - 1] || ""; 
        }
        else {
            this.currentPosition += 1;
            return this.history[this.currentPosition];
        }
    }
    
}