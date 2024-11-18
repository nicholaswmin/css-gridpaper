import test from 'node:test'
import Browser from './browser.js'

/*
These tests assume: 
  :root { --base-size: 15px; --line-height: 1.5; }
*/

test('<css-gridpaper>', async t => {
  let browser

  t.before(() => {
    browser = new Browser(import.meta.dirname, '../index.html')

    return browser.launch()
  })

  t.after(() => browser.close())
  t.afterEach(() => browser.page.reload())

  await t.test('element exists', async t => {
    const result = await browser.getComputedStyles('css-gridpaper')
    t.assert.ok(result['CSS-GRIDPAPER'])
  })
  
  await t.test('required CSS variables are defined', async t => {
    const cssvars = await browser.getCSSVariables()
    
    await t.test('defines a --base-size', async t => {
      t.assert.ok(cssvars['--base-size'], cssvars)

      await t.test('in pixels', async t => {
        t.assert.ok(cssvars['--base-size'].endsWith('px'))
      })
    })

    await t.test('defines a --line-height', async t => {
      t.assert.ok(cssvars['--line-height'], cssvars)

      await t.test('as decimal', async t => {
        t.assert.ok(!isNaN(cssvars['--line-height']))
      })
    })
  })
  
  await t.test('instantiation', async t => {
    await t.test('sets a 22.5px grid background on <body>', async t => {
      const background = await browser.getBodyBackground()

      t.assert.ok(background.includes('22.5px 22.5px'), background)
    })
  })
  
  await t.test('updating CSS variables', async t => {    
    await t.test('via elements that fire "input" events', async t => {
      t.before(async () => {
        await browser.page.locator('#base-size').fill('30');
        await browser.page.locator('#line-height').fill('3');
      })
      
      await t.test('redraws using the new values ', async t => {
        const background = await browser.getBodyBackground()

        t.assert.ok(background.includes('90px 90px'), background)
      })
    })
    
    await t.test('via elements that fire non "input" events', async t => {
      t.before(async () => {
        browser.setCSSProps([
          ['--base-size', 50], ['--line-height', 1.3]
        ]) 
      })
      
      await t.test('does not redraw', async t => {
        await browser.dispatchWindowEvent('click')
        const background = await browser.getBodyBackground()

        t.assert.ok(background.includes('22.5px 22.5px'), background)
      })
    })
  })
  
  await t.test('element.draw(size)', async t => {        
    await t.test('redraws at specified "size" argument  ', async t => {
      await browser.page.evaluate(() => {   
        document.querySelector('css-gridpaper').draw(50)
      })

      const background = await browser.getBodyBackground()

      t.assert.ok(background.includes('50px 50px'), background)
    })
  })
  
  await t.test('element.draw(), no arguments', async t => {       
   t.before(async () => {
     await browser.setCSSProps([
       ['--base-size', 60], ['--line-height', 1]
     ]) 
     
     await browser.page.evaluate(() => {   
       document.querySelector('css-gridpaper').draw()
     })
   })
    
    await t.test('redraws from CSS variables', async t => {
      const background = await browser.getBodyBackground()

      t.assert.ok(background.includes('60px 60px'), background)
    })
  })
})
