
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
    // const links = await scraper.getDom(url) // Gets the urls from the web page.
     //await scraper.getCalendar(links[0]) // Check the first url.
     //await scraper.createCinema(links[1]) // Check the second url.
     //await scraper.bookRestaurant(links[2]) // Check the third url.
   }
 }