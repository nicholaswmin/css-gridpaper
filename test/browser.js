/*
 * Open a browser to a page 
 *
 * - works for local HTML files that don't run on server
 * - dont append "file://" to the url, it's done here.
 *  - no absolute paths in HTML, i.e: `/style.css`, use `style.css` instead.
 * - includes util. methods for these tests
 *
 * // i.e: visit `index.html`
 * const browser = await (new Browser('./index.html')).launch()
 *
 * // use puppetteer page API:
 * await browser.page.evaluate...
 * // or use a utility method:
 * await browser.getTagnames('div')...
 *
 * // always close browser
 * await browser.close()
 */

import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

export default class Browser {
  constructor(basedir, url) {
    this.url = pathToFileURL(join(basedir, url))
    this.browser = null
    this.page = null
  }
  
  async launch(options) {
    this.browser = await puppeteer.launch({
      ...options,
      args: ['--allow-file-access-from-files']
    })
    
    this.page = await this.browser.newPage()
    await this.page.goto(this.url.href)
    await this.page.setViewport()

    return this
  }
  
  close() {
    this.browser.close()
  }

  // Sets CSS custom props on `:root`
  // i.e: [['--base-size', 10], ['--line-height', 1.5]]
  // important: the example controls won't sync, its ok
  setCSSProps(entries) {
    return this.page.evaluate(entries => {
      entries.forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
    }, entries)
  }
  
  /* Does what it says on the tin */
  dispatchWindowEvent(eventName) {
    return this.page.evaluate(eventName => {   
      window.dispatchEvent(new CustomEvent(eventName))
    }, eventName)
  }
  
  async getBodyBackground() {
    const styles = await this.getComputedStyles('body')

    return styles['BODY'].background
  }
  
  // returns all CSS variables
  // {'--base-size': 15, '--line-height': 1.5 }...
  getCSSVariables() {
    return this.page.evaluate(() => {
      const styles = window.getComputedStyle(document.documentElement)
  
      return Object.fromEntries(Array.from(document.styleSheets)
        .flatMap(sheet => Array.from(sheet.cssRules))
        .filter(rule => rule instanceof CSSStyleRule)
        .flatMap(css => Array.from(css.style))
        .filter(prop => prop.startsWith('--'))
        .map(prop => [prop, styles.getPropertyValue(prop)]))
    })
  }

  // returns useful computed CSS for selector, per tag.
  // i.e: { H1: { ...styles }, H2: { ...styles } }
  async getComputedStyles(selector) {
    const elements = await Promise.all((await this.page.$$(selector))
      .map(el => this.page.evaluate(el => ({ 
        tagName: el.tagName,
        text: `${el.innerText.slice(0, 30)} ...`,
        background: getComputedStyle(el).getPropertyValue('background'),
        lineHeight: getComputedStyle(el).getPropertyValue('line-height'),
        fontSize: getComputedStyle(el).getPropertyValue('font-size')
      }), el))
    ) 
    
    return elements.reduce((acc, el) => ({ ...acc, [el.tagName]: el }), {})
  }
}
