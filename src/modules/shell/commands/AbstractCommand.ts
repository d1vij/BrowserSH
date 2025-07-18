import type { TCommand, TFlag, Tokens, TOption } from "../core/__typing";
import type { MaybeAsyncFunction } from "./__typing";
/**
 * The abstract class which every primary command of this terminal inherits and implements
 */
export abstract class AbstractCommand {
    /**
     * Name of primary command
    */
    public abstract name: TCommand;

    /**
     * all the valid flags primary command can have
    */
    public abstract flags: Array<TFlag>;

    /**
     * all the valid options primary command can have
    */
    public abstract options: Array<TOption>;

    /**
     * method that gets called when to execute the command. Handles both the execution and error handling which may occur during execution
    */
    public execute(tokens: Tokens, done?:MaybeAsyncFunction<void>): void {
        /**
         * The callback based handling of post command execution stuff allows 
         * for the commands to be both synchronous as well as asynchronous,
         * without adding any addtional overhead onto their "executor" ie the __execute function. 
         * 
         * The return type of __execute being both void and Promise<void>
         * makes sure that irrespective of what the __execute function returns,
         * the post-execution processes would be handled gracefully.
         * 
         * Anything passed as the "done" callback function would be called post command execution
         * irrespective of the command execution was successfull or threw an error.
         * Moreover, since all thrown errors are handled here, theres no need for catch statements in the __execute() methods's body
         * 
         * eg
         *  sync case -> (tokens){
         *         doSmth();
         *         return;
         *   }
         * 
         * async case -> async (tokens){
         *      await doSmth();
         *      return; => void wrapped in promise
         * }
         */

        // synchronous case
        try {
            const result = this.__execute(tokens);

            // asynchronous case
            if (result instanceof Promise) {
                console.log("is promise")
                result
                    .catch(err => this.handleErrors(err)) // <- ideally this call should not throw an error
                    .finally(() => done?.());
            }
            else done?.();
        } catch (err) {
            this.handleErrors(err)
            done?.(); // called everytime irrespective of what happend (could probably cause some bugs later on) (okay keeping it in finally block caused it to get immeidately called);

        }
    }

    /**
     * Main command executor, not to be called from outside
     */
    protected abstract __execute(tokens: Tokens): void | Promise<void>;
    /**
     * Command specific error handling
     */
    public abstract handleErrors(err: any): void;

    /**
     * returns info about the primary command
     */
    public abstract info(): Array<string>;

    /**
     * returns info about the primary command
     */
    public abstract usage(): Array<string>;
}