
/**
 * The application module.
 *
 * @author Elida Arrechea <es222vs@student.lnu.se>
 * @version 1.0.0
 */

 import { AskForName } from './AskForName.js'

 /**
  * Encapsulates a Node application.
  */
 export class Application {
   /**
    * Initializes a new instance of the Application class.
    *
    */
 
   /**
    * Scrape the web page.
    *
    *@param {string} url - The URL for the API request.
    */
   async run (url) {
     const askForName = new AskForName()
     askForName.getName()
     askForName.getAge()
   }
 }