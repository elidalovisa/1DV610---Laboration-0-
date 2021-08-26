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
  constructor() {
    this.name = '' // Empty string to store users name in.
  }

  /**
   * Function to ask for users name.
   *
   *
   */
  getName() {
    const prompt = require('prompt-sync')()
    const name = prompt('What is your name?')
    this.name = name
    console.log(`Hey there ${this.name}`)
  }

  /**
   * Function to call API.
   *
   * @param {string} url - The URL of the web page to scrape.
   * @returns {Array} - Array with scraped links.
   */
  async getAge() {
    const responseAge = await fetch(`https://api.agify.io?name=${this.name}`) // Fetch HTML from url.
    const age = await responseAge.json() // Make HTML response to a json object
    const responseGender = await fetch(`https://api.genderize.io?name=${this.name}`) // Fetch HTML from url.
    const gender = await responseGender.json() // Make HTML response to a json object
    const responseAdvice = await fetch(`https://api.adviceslip.com/advice`) // Fetch HTML from url.
    const advice = await responseAdvice.json() // Make HTML response to a json object
    console.log('I think that you are ' + age.age + ' years old, a ' + gender.gender + ' and here is an advice for you: ' + advice.slip.advice)
  }
}
