const puppeteer = require('puppeteer');

(async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://en.wikipedia.org/wiki/Zoobooks', { waitUntil: 'networkidle2', timeout: 0 });
    var i = 1;
    while (1) {
        try {
            await page.waitForXPath(`//*[@id="mw-content-text"]/div[1]/ul[1]/li[${i}]`, { timeout: 3000 });
            let elHandle = await page.$x(`//*[@id="mw-content-text"]/div[1]/ul[1]/li[${i}]`);
            let lamudiNewPropertyCount = await page.evaluate(el => el.textContent, elHandle[0]);
            console.log(lamudiNewPropertyCount);
            i += 1;
        }
        catch (e) {
            break;
        }
    }
    await browser.close();
})();