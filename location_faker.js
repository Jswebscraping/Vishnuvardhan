const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const screenshotPath = 'location.png'
  const url = 'https://developers.google.com/maps/documentation/javascript/examples/map-geolocation'

  // Firstly, we need to override the permissions
  // so we don't have to click "Allow Location Access"
  const context = browser.defaultBrowserContext()
  await context.overridePermissions(url, ['geolocation'])

  const page = await browser.newPage()

  // whenever the location is requested, it will be set to our given lattitude, longitude
  await page.evaluateOnNewDocument(function () {
    navigator.geolocation.getCurrentPosition = function (cb) {
      setTimeout(() => {
        cb({
    coords: {
        accuracy: 21,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: 0.62896,
        longitude: 77.3111303,
        speed: null
    },
    timestamp: 0
})
      }, 1000)
    }
  })

  await page.goto(url, { waitUntil: 'networkidle2' })
  await page.screenshot({ path: 'screenshot.png' })

  await browser.close()
})()