const puppeteer = require('puppeteer');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');
const csv = require('fast-csv');
const fs = require('fs');
var scrapedData = [];
async function getData(page) {
    var ws = fs.createWriteStream('Homedepot.csv');
    await page.goto('https://www.homedepot.com/p/Liberty-Acrylic-Bar-3-in-76-mm-Champagne-Bronze-and-Clear-Drawer-Pull-P33776C-720-CP/315041133', { waitUntil: 'networkidle2', timeout: 0 });
    for (i = 1; i <= 3; i++) {
        const elements = await page.$x(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[7]/div/div[1]/div[2]/button[${i}]`)
        await elements[0].click();
        for (j = 1; j <= 5; j++) {
            const elements1 = await page.$x(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[7]/div/div[2]/div[2]/div[${j}]/button`)
            await elements1[0].click();
            currentUrl = await page.url();
            await scrollPageToBottom(page);
            try {
                await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/div[2]/div/div[1]/div/div/div[2]/span/h1`, { timeout: 3000 });
                let title_ele = await page.$x(`//*[@id="root"]/div/div[3]/div/div/div[2]/div/div[1]/div/div/div[2]/span/h1`);
                let title = await page.evaluate(h1 => h1.textContent, title_ele[0]);
                await page.waitForXPath(`//*[@id="standard-price"]/div/div`);
                let price_ele = await page.$x(`//*[@id="standard-price"]/div/div`);
                let price = await page.evaluate(pr => pr.textContent, price_ele[0]);
                await page.waitForXPath(`//*[@id="ratings-and-reviews"]/div[2]/div[1]/ul/li[1]/div/span[2]/div`);
                let rating_ele = await page.$x(`//*[@id="ratings-and-reviews"]/div[2]/div[1]/ul/li[1]/div/span[2]/div`);
                let rating = await page.evaluate(rat => rat.getAttribute('title'), rating_ele[0]);
                await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[9]/div/div/div[1]/div/div/fieldset/div/div[2]/div[1]`);
                let avail_ele = await page.$x(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[9]/div/div/div[1]/div/div/fieldset/div/div[2]/div[1]`);
                let avail = await page.evaluate(ava => ava.textContent, avail_ele[0]);
                scrapedData.push({
                    Title: title,
                    Price: price,
                    Rating: rating,
                    Availability: avail,
                    CurrentUrl: currentUrl
                });
            }
            catch (e) {
                await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/div[2]/div/div[1]/div/div/div[3]/span/h1`);
                let title_ele = await page.$x(`//*[@id="root"]/div/div[3]/div/div/div[2]/div/div[1]/div/div/div[3]/span/h1`);
                let title = await page.evaluate(h1 => h1.textContent, title_ele[0]);
                await page.waitForXPath(`//*[@id="standard-price"]/div/div`);
                let price_ele = await page.$x(`//*[@id="standard-price"]/div/div`);
                let price = await page.evaluate(pr => pr.textContent, price_ele[0]);
                await page.waitForXPath(`//*[@id="ratings-and-reviews"]/div[2]/div[1]/ul/li[1]/div/span[2]/div`);
                let rating_ele = await page.$x(`//*[@id="ratings-and-reviews"]/div[2]/div[1]/ul/li[1]/div/span[2]/div`);
                let rating = await page.evaluate(rat => rat.getAttribute('title'), rating_ele[0]);
                try {
                    await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[9]/div/div/div[1]/div/div[3]/div/div[1]`, { timeout: 3000 });
                    let avail_ele = await page.$x(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[9]/div/div/div[1]/div/div[3]/div/div[1]`);
                    let avail = await page.evaluate(ava => ava.textContent, avail_ele[0]);
                    scrapedData.push({
                        Title: title,
                        Price: price,
                        Rating: rating,
                        Availability: avail,
                        CurrentUrl: currentUrl
                    });
                } catch (e) {
                    await page.waitForXPath(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[9]/div/div/div[1]/div/div/fieldset/div/div[2]/div[1]`);
                    let avail_ele = await page.$x(`//*[@id="root"]/div/div[3]/div/div/div[3]/div/div/div[9]/div/div/div[1]/div/div/fieldset/div/div[2]/div[1]`);
                    let avail = await page.evaluate(ava => ava.textContent, avail_ele[0]);
                    scrapedData.push({
                        Title: title,
                        Price: price,
                        Rating: rating,
                        Availability: avail,
                        CurrentUrl: currentUrl
                    });
                }
            }
        }
    }
    csv.write(scrapedData, { headers: true }).pipe(ws);
    return scrapedData;
}

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const srpData = await getData(page);
    console.log(srpData);
    await browser.close();
}
main();
