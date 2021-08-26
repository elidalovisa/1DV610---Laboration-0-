/**
 * The starting point of the application.
 *
 * @author Elida Arrechea <es222vs@student.lnu.se>
 * @version 1.0.0
 */

 import { Application } from './application.js'

 /**
  * The main function of the application.
  */
 const main = async () => {
   try {
     const newApplication = new Application()
     await newApplication.run()
   } catch (error) {
     console.error(error.message)
   }
 }
 
 main()
 