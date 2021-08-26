/**
 * The module that handle the questions.
 *
 * @author Elida Arrechea <es222vs@student.lnu.se>
 * @version 1.0.0
 */

 import { createRequire } from 'module'
 const require = createRequire(import.meta.url)
 const prompt = require('prompt-sync')
 import fetch from 'node-fetch'
 
 /**
  * Ask for name.
  */
 export class AskForName {
   /**
    * Get the name of the user and send it to an API.
    *
    */
   constructor () {
    this.name = '' // Empty string to store users name in.
   }
 
   /**
    * Function to ask for users name.
    *
    *
    */
   getName () {
  const prompt = require('prompt-sync')()
  const name = prompt('What is your name?')
  console.log(`Hey there ${name}`)
   }
 
   /**
    * Function to scrape links from startpage.
    *
    * @param {string} url - The URL of the web page to scrape.
    * @returns {Array} - Array with scraped links.
    */
   async getDom (url) {
     url = this._userUrl // Get the user input.
     const response = await fetch(url) // Fetch HTML from url.
     const text = await response.text() // Make HTML response to a text object.
     const dom = new JSDOM(text) // Create a DOM of text object.
     const alinks = Array.from(dom.window.document.querySelectorAll('a[href^="http://"],a[href^="https://"]')) // Get all links from web page and save in an array.
       .map(anchorElement => anchorElement.href) // Loop through all <a> and <a href> elements.
     console.log('Scraping links...OK')
     return alinks
   }
 
   /**
    * Creates a calendar object for each person and check what day all are availible.
    *
    * @param {string} url - The URL of the web page to scrape.
    * @returns {object} - Return text object representing HTML site.
    */
   async getCalendar (url) {
     const response = await fetch(url) // Fetch HTML from url.
     const text = await response.text() // Make HTML response to a text object.
     const dom = new JSDOM(text) // Create a DOM of text object.
     const alinks = Array.from(dom.window.document.querySelectorAll('a')) // Get all links from web page and save in an array.
       .map(anchorElement => anchorElement.href) // Loop through all <a> and <a href> elements.
     this.calendarLinks = alinks.map(link => link.slice(2)) // Take away ./ to make absolute url.
     let calendarObj = [] // Empty array to store calendar object in.
     if (url === 'https://cscloud6-127.lnu.se/scraper-site-1/calendar/') { // If site 1.
       const map = this.calendarLinks.map(link => 'https://cscloud6-127.lnu.se/scraper-site-1/calendar/' + link)
       const promisesUrls = map.map(url => this.fetchLinks(url)) // Get everybodys calendars and create a DOM for each calendar page.
       const calendarDoms = await Promise.all(promisesUrls) // Wait for the promises to resolve.
       calendarObj = calendarObj.concat(calendarDoms.map(table => this.createCalendar(table)))
     } else { // If site 2.
       const map = this.calendarLinks.map(link => 'https://cscloud6-127.lnu.se/scraper-site-2/calendar2/' + link)
       const promisesUrls = map.map(url => this.fetchLinks(url)) // Get everybodys calendars.
       const calendarDoms = await Promise.all(promisesUrls) // Wait for the promises to resolve.
       calendarObj = calendarObj.concat(calendarDoms.map(table => this.createCalendar(table)))
     }
     const howManyPersons = calendarObj.length // Store how many persons there is in variable.
     const friday = calendarObj.filter(person => person.days.Friday === 'ok') // Filter everything that is not 'ok'.
     if (friday.length === howManyPersons) { // Check if friday and person is same number, that means all are availible.
       this.availibleFriday = 'Friday'
     }
     const saturday = calendarObj.filter(person => person.days.Saturday === 'ok') // Filter everything that is not 'ok'.
     if (saturday.length === howManyPersons) { // Check if saturday and person is same number, that means all are availible.
       this.availibleSaturday = 'Saturday'
     }
 
     const sunday = calendarObj.filter(person => person.days.Sunday === 'ok') // Filter everything that is not 'ok'.
     if (sunday.length === howManyPersons) { // Check if sunday and person is same number, that means all are availible.
       this.availibleSunday = 'Sunday'
     }
     console.log('Scraping available days...OK')
     return text
   }
 
   /**
    * Function to create calendar object.
    *
    * @param {object} domObject - A dom object
    * @returns {object} - Returns a calendar object.
    */
   createCalendar (domObject) {
     const calendarObj = { name: '', days: '', availible: '' } // Object to store calendar.
     const name = Array.from(domObject.window.document.querySelectorAll('h2')) // Get the name from web page and save in an array.
       .map(h2 => (calendarObj.name = h2.textContent)) // Loop through all <h2> elements.
     calendarObj.name = name[0] // Add name to calendar object.
     const days = Array.from(domObject.window.document.querySelectorAll('th')) // Get all days from web page and save in an array.
       .map(th => (calendarObj.days = th.textContent)) // Loop through all <th> elements.
     const availible = Array.from(domObject.window.document.querySelectorAll('td')) // See if person is availible and save in an array.
       .map(td => (calendarObj.availible = td.textContent.toLowerCase())) // Loop through all <td> elements and make all strings lower case.
     calendarObj.days = days.reduce((acc, k, i) => { acc[k] = availible[i]; return acc }, {}) // Loop and make object of days to add all days.
     return calendarObj
   }
 
   /**
    * Creates a DOM from a url.
    *
    * @param {string} url - The URL to scrape.
    * @returns {JSDOM} - A JSDOM object.
    */
   async fetchLinks (url) {
     const fetchLink = await fetch(url) // Fetch the url from the web page.
     const textLink = await fetchLink.text() // Make HTML response to a text object.
     const domLink = new JSDOM(textLink) // Create a DOM of text object.
     return domLink
   }
 
   /**
    * Get time slot for all movies and days.
    *
    * @param {string} url - The URL to scrape.
    * @returns {object} - Return text object representing HTML site.
    */
   async createCinema (url) {
     const response = await fetch(url) // Fetch HTML from url.
     const text = await response.text() // Make HTML response to a text object.
     const domCinema = new JSDOM(text) // Create a DOM of text object.
     const days = Array.from(domCinema.window.document.querySelector('#day')) // Get all days and save in an array.
       .map(option => option.value)
     days.shift()
 
     const moviesValue = Array.from(domCinema.window.document.querySelector('#movie')) // Get all movies and save in an array.
       .map(option => option.value)
     moviesValue.shift()
 
     const movies = Array.from(domCinema.window.document.querySelectorAll('option')) // Get all movies and save in an array.
       .map(option => option.textContent)
     let moviesArray = [] // Empty array to store movie objects in.
     for (let i = 0; i < movies.length; i++) { // make every movie an object
       const objMovie = { movie: movies[i].trim() } // Create an object for each availible table.
       moviesArray.push(objMovie)
     }
     moviesArray = moviesArray.slice(5, 8) // Take away headers and days from array.
     if (url === 'https://cscloud6-127.lnu.se/scraper-site-1/cinema') { // If url is site 1
       if (this.availibleFriday.length > 0) { // Check if friday is availible in calendar.
         this.firstMovie = await this.getTimeSlot(url + '/check?day=' + days[0] + '&movie=' + moviesValue[0])
         this.secondMovie = await this.getTimeSlot(url + '/check?day=' + days[0] + '&movie=' + moviesValue[1])
         this.thirdMovie = await this.getTimeSlot(url + '/check?day=' + days[0] + '&movie=' + moviesValue[2])
         for (let i = 0; i < this.firstMovie.length; i++) { // Add movie title to object.
           this.firstMovie[i].movie = moviesArray[0].movie
         }
         for (let i = 0; i < this.secondMovie.length; i++) {
           this.secondMovie[i].movie = moviesArray[1].movie
         }
         for (let i = 0; i < this.thirdMovie.length; i++) {
           this.thirdMovie[i].movie = moviesArray[2].movie
         }
         this.availibleMoviesFirstUrl = this.availibleMoviesFirstUrl.concat(this.firstMovie, this.secondMovie, this.thirdMovie) // Merge all arrays in to one array.
       }
       if (this.availibleSaturday.length > 0) { // Check if saturday is availible in calendar.
         this.firstMovie = await this.getTimeSlot(url + '/check?day=' + days[1] + '&movie=' + moviesValue[0])
         this.secondMovie = await this.getTimeSlot(url + '/check?day=' + days[1] + '&movie=' + moviesValue[1])
         this.thirdMovie = await this.getTimeSlot(url + '/check?day=' + days[1] + '&movie=' + moviesValue[2])
         for (let i = 0; i < this.firstMovie.length; i++) { // Add movie title to object.
           this.firstMovie[i].movie = moviesArray[0].movie
         }
         for (let i = 0; i < this.secondMovie.length; i++) {
           this.secondMovie[i].movie = moviesArray[1].movie
         }
         for (let i = 0; i < this.thirdMovie.length; i++) {
           this.thirdMovie[i].movie = moviesArray[2].movie
         }
         this.availibleMoviesFirstUrl = this.availibleMoviesFirstUrl.concat(this.firstMovie, this.secondMovthis.thirdMovie) // Merge all arrays in to one array.
       }
       if (this.availibleSunday.length > 0) { // Check if sunday is availible.
         this.firstMovie = await this.getTimeSlot(url + '/check?day=' + days[2] + '&movie=' + moviesValue[0])
         this.secondMovie = await this.getTimeSlot(url + '/check?day=' + days[2] + '&movie=' + moviesValue[1])
         this.thirdMovie = await this.getTimeSlot(url + '/check?day=' + days[2] + '&movie=' + moviesValue[2])
         for (let i = 0; i < this.firstMovie.length; i++) { // Add movie title to object.
           this.firstMovie[i].movie = moviesArray[0].movie
         }
         for (let i = 0; i < this.secondMovie.length; i++) {
           this.secondMovie[i].movie = moviesArray[1].movie
         }
         for (let i = 0; i < this.thirdMovie.length; i++) {
           this.thirdMovie[i].movie = moviesArray[2].movie
         }
         this.availibleMoviesFirstUrl = this.availibleMoviesFirstUrl.concat(this.firstMovie, this.secondMovie, this.thirdMovie) // Merge all arrays in to one array.
       }
     }
 
     if (url === 'https://cscloud6-127.lnu.se/scraper-site-2/cinema2') { // If base url is site 2
       if (this.availibleFriday.length > 0) { // Check if friday is availible in calendar.
         this.firstMovie = await this.getTimeSlot(url + '/check?day=' + days[0] + '&movie=' + moviesValue[0])
         this.secondMovie = await this.getTimeSlot(url + '/check?day=' + days[0] + '&movie=' + moviesValue[1])
         this.thirdMovie = await this.getTimeSlot(url + '/check?day=' + days[0] + '&movie=' + moviesValue[2])
         for (let i = 0; i < this.firstMovie.length; i++) { // Add movie title to object.
           this.firstMovie[i].movie = moviesArray[0].movie
         }
         for (let i = 0; i < this.secondMovie.length; i++) {
           this.secondMovie[i].movie = moviesArray[1].movie
         }
         for (let i = 0; i < this.thirdMovie.length; i++) {
           this.thirdMovie[i].movie = moviesArray[2].movie
         }
         this.availibleMoviesSecondUrl = this.availibleMoviesSecondUrl.concat(this.firstMovie, this.secondMovie, this.thirdMovie) // Merge all arrays in to one array.
       }
 
       if (this.availibleSaturday.length > 0) { // Check if saturday is availible.
         this.firstMovie = await this.getTimeSlot(url + '/check?day=' + days[1] + '&movie=' + moviesValue[0])
         this.secondMovie = await this.getTimeSlot(url + '/check?day=' + days[1] + '&movie=' + moviesValue[1])
         this.thirdMovie = await this.getTimeSlot(url + '/check?day=' + days[1] + '&movie=' + moviesValue[2])
         for (let i = 0; i < this.firstMovie.length; i++) { // Add movie title to object.
           this.firstMovie[i].movie = moviesArray[0].movie
         }
         for (let i = 0; i < this.secondMovie.length; i++) {
           this.secondMovie[i].movie = moviesArray[1].movie
         }
         for (let i = 0; i < this.thirdMovie.length; i++) {
           this.thirdMovie[i].movie = moviesArray[2].movie
         }
         this.availibleMoviesSecondUrl = this.availibleMoviesSecondUrl.concat(this.firstMovie, this.secondMovie, this.thirdMovie)
       }
 
       if (this.availibleSunday.length > 0) { // Check if sunday is availible.
         this.firstMovie = await this.getTimeSlot(url + '/check?day=' + days[2] + '&movie=' + moviesValue[0])
         this.secondMovie = await this.getTimeSlot(url + '/check?day=' + days[2] + '&movie=' + moviesValue[1])
         this.thirdMovie = await this.getTimeSlot(url + '/check?day=' + days[2] + '&movie=' + moviesValue[2])
         for (let i = 0; i < this.firstMovie.length; i++) { // Add movie title to object.
           this.firstMovie[i].movie = moviesArray[0].movie
         }
         for (let i = 0; i < this.secondMovie.length; i++) {
           this.secondMovie[i].movie = moviesArray[1].movie
         }
         for (let i = 0; i < this.thirdMovie.length; i++) {
           this.thirdMovie[i].movie = moviesArray[2].movie
         }
         this.availibleMoviesSecondUrl = this.availibleMoviesSecondUrl.concat(this.firstMovie, this.secondMovie, this.thirdMovie)
       }
     }
     console.log('Scraping showtimes...OK')
     return text
   }
 
   /**
    * Check what movies are availblie.
    *
    * @param {string} url - The URL to scrape.
    * @returns {object} - A object with day, time and movie.
    */
   async getTimeSlot (url) {
     const movie = await fetch(url) // Check movie with url.
     const movieText = await movie.text()
     const parsedText = JSON.parse(movieText) // Parse JSON from server to a javascript object.
     this.timeSlotObj = parsedText.filter(status => status.status > 0) // Filter out all movies with status 0, since they are not availible.
     return this.timeSlotObj
   }
 
   /**
    * Function to make a request to log in to book table at the restaurant.
    *
    * @param {string} url - The URL to scrape.
    * @returns {object} - A object with day, time and movie.
    */
   async bookRestaurant (url) {
     // First fetch to get login page.
     const getLoginPage = await fetch(url
       , {
         headers: {
           'Access-Control-Allow-Origin': '*'
         },
         method: 'get',
         redirect: 'manual',
         credentials: 'include',
         mode: 'cors'
       })
     const redirectPage = await getLoginPage.text()
     const dom = new JSDOM(redirectPage) // Create a DOM of text object.
     const getRedirectUrl = Array.from(dom.window.document.querySelectorAll('form')).map(method => method.action)
 
     // Second fetch to login to booking.
     const urlToFetch = url + getRedirectUrl
     const loginToBooking = await fetch(urlToFetch
       , {
         body: 'username=zeke&password=coys&submit=login',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           cookie: ''
         },
         method: 'post',
         redirect: 'manual',
         credentials: 'include'
       })
     const loginPage = await loginToBooking.text()
     const domLoginPage = new JSDOM(loginPage) // Create a DOM of text object.
     Array.from(domLoginPage.window.document.querySelectorAll('body')).map(body => body.textContent)
     const getCookie = loginToBooking.headers.get('set-cookie')
     const redUrl = loginToBooking.headers.get('location')
 
     // Third fetch to get to booking site
     const responseBooking = await fetch(redUrl
       , {
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           cookie: getCookie
         },
         method: 'get',
         redirect: 'manual',
         credentials: 'include'
       })
     const bookingPage = await responseBooking.text()
     const domBookingPage = new JSDOM(bookingPage) // Create a DOM of text object.
     const getDaysResturant = Array.from(domBookingPage.window.document.querySelectorAll('p')).map(span => span.textContent.trim())
 
     // -- Get availible tables Friday --//
     const tables = getDaysResturant.slice(9) // Take away text content.
     let tablesFriday = tables.slice(1, 5)
     tablesFriday = tablesFriday.filter(word => word.length < 11) // Filter out availible times.
     tablesFriday = tablesFriday.map(table => table.slice(0, 5)) // Get only start time for table.
     for (let i = 0; i < tablesFriday.length; i++) {
       const objAvailibleTableFriday = { day: '05', time: tablesFriday[i] } // Create an object for each availible table.
       this.fridayArrayBookTable.push(objAvailibleTableFriday)
     }
 
     // -- Get availible tables Saturday --//
     let tablesSaturday = tables.slice(7, 11)
     tablesSaturday = tablesSaturday.filter(word => word.length < 11)
     tablesSaturday = tablesSaturday.map(table => table.slice(0, 5))
     for (let i = 0; i < tablesSaturday.length; i++) {
       const objAvailibleTableSaturday = { day: '06', time: tablesSaturday[i] } // Create an object for each availible table.
       this.saturdayArrayBookTable.push(objAvailibleTableSaturday)
     }
 
     // -- Get availible tables Sunday --//
     let tablesSunday = tables.slice(13, 17)
     tablesSunday = tablesSunday.filter(word => word.length < 11)
     tablesSunday = tablesSunday.map(table => table.slice(0, 5))
     for (let i = 0; i < tablesSunday.length; i++) {
       const objAvailibleTableSunday = { day: '07', time: tablesSunday[i] } // Create an object for each availible table.
       this.sundayArrayBookTable.push(objAvailibleTableSunday)
     }
     console.log('Scraping possible reservations...OK')
     this.getAvailibleTimes(url)
   }
 
   /**
    * Function to find availible table accordning to cinema movie slots.
    *
    * @param {string} url - The URL to scrape.
    */
   getAvailibleTimes (url) {
     if (url === 'https://cscloud6-127.lnu.se/scraper-site-1/dinner/') { // If base url is site 1.
       console.log(' ')
       console.log(' ')
       console.log('Suggestions')
       console.log('===========')
       const checkFriday = this.availibleMoviesFirstUrl.filter(movie => movie.day === '05')
       if (checkFriday.length > 0) { // If there is movies availible on friday.
         for (let i = 0; i < checkFriday.length; i++) { // Loop time of cinema and compare with reservation time.
           for (let j = 0; j < this.fridayArrayBookTable.length; j++) {
             if (this.fridayArrayBookTable[j].time.slice(0, 2) > checkFriday[i].time.slice(0, 2)) { // If there is a dinner reservation after movie starts.
               console.log(`* On Friday, "${checkFriday[i].movie}" begins at ${checkFriday[i].time}, and there is a free table to book between ${this.fridayArrayBookTable[j].time}.`)
             }
           }
         }
       }
       const checkSaturday = this.availibleMoviesFirstUrl.filter(movie => movie.day === '06')
       if (checkSaturday.length > 0) {
         for (let i = 0; i < checkSaturday.length; i++) { // Loop time of cinema and compare with reservation time.
           for (let j = 0; j < this.saturdayArrayBookTable.length; j++) {
             if (this.saturdayArrayBookTable[j].time.slice(0, 2) > checkSaturday[i].time.slice(0, 2)) { // If there is a dinner reservation after movie starts.
               console.log(`* On Saturday, "${checkSaturday[i].movie}" begins at ${checkSaturday[i].time}, and there is a free table to book between ${this.saturdayArrayBookTable[j].time}.`)
             }
           }
         }
       }
       const checkSunday = this.availibleMoviesFirstUrl.filter(movie => movie.day === '07')
       if (checkSunday.length > 0) {
         for (let i = 0; i < checkSunday.length; i++) { // Loop time of cinema and compare with reservation time.
           for (let j = 0; j < this.sundayArrayBookTable.length; j++) {
             if (this.sundayArrayBookTable[j].time.slice(0, 2) > checkSunday[i].time.slice(0, 2)) { // If there is a dinner reservation after movie starts.
               console.log(`* On Sunday, "${checkSunday[i].movie}" begins at ${checkSunday[i].time}, and there is a free table to book between ${this.sundayArrayBookTable[j].time}.`)
             }
           }
         }
       }
     }
     if (url === 'https://cscloud6-127.lnu.se/scraper-site-2/dinner2/') { // If base url is site 2.
       console.log(' ')
       console.log(' ')
       console.log('Suggestions')
       console.log('===========')
       const checkFriday2 = this.availibleMoviesSecondUrl.filter(movie => movie.day === '05') // Get all movies for friday.
       if (checkFriday2.length > 0) { // Check if array has any movies.
         for (let i = 0; i < checkFriday2.length; i++) { // Loop time of cinema and compare with reservation time.
           for (let j = 0; j < this.fridayArrayBookTable.length; j++) {
             if (this.fridayArrayBookTable[j].time.slice(0, 2) > checkFriday2[i].time.slice(0, 2)) { // If there is a dinner reservation after movie starts.
               console.log(`* On Friday, "${checkFriday2[i].movie}" begins at ${checkFriday2[i].time}, and there is a free table to book between ${this.fridayArrayBookTable[j].time}.`)
             }
           }
         }
       }
       const checkSaturday2 = this.availibleMoviesSecondUrl.filter(movie => movie.day === '06') // Get all movies for saturday.
       if (checkSaturday2.length > 0) {
         for (let i = 0; i < checkSaturday2.length; i++) { // Loop time of cinema and compare with reservation time.
           for (let j = 0; j < this.saturdayArrayBookTable.length; j++) {
             if (this.saturdayArrayBookTable[j].time.slice(0, 2) > checkSaturday2[i].time.slice(0, 2)) { // If there is a dinner reservation after movie starts.
               console.log(`* On Saturday, "${checkSaturday2[i].movie}" begins at ${checkSaturday2[i].time}, and there is a free table to book between ${this.saturdayArrayBookTable[j].time}.`)
             }
           }
         }
       }
       const checkSunday2 = this.availibleMoviesSecondUrl.filter(movie => movie.day === '07') // Get all movies for sunday.
       if (checkSunday2.length > 0) {
         for (let i = 0; i < checkSunday2.length; i++) { // Loop time of cinema and compare with reservation time.
           for (let j = 0; j < this.sundayArrayBookTable.length; j++) {
             if (this.sundayArrayBookTable[j].time.slice(0, 2) > checkSunday2[i].time.slice(0, 2)) { // If there is a dinner reservation after movie starts.
               console.log(`* On Sunday, "${checkSunday2[i].movie}" begins at ${checkSunday2[i].time}, and there is a free table to book between ${this.sundayArrayBookTable[j].time}.`)
             }
           }
         }
       }
     }
   }
 }
 