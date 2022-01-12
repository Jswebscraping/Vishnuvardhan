const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.goto('https://soundcloud.com/')
  await page.hover('.playableTile__artwork')
  await page.screenshot({ path: 'hover.png' })
  await browser.close()
})()