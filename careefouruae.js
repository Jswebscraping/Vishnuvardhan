const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('fast-csv');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');
var scrapedData = [];
async function main() {
    var data1 = fs.readFileSync("keywordloblaw.csv", "utf8");
    data1 = data1.split("\n");
    for (let i in data1) {
        data1[i] = data1[i].split(",");
    }
    for (let word of data1) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const srpData = await getData(page, word[0]);
        console.log(srpData);
        await browser.close();
    }
    console.log("Completed");
} main();
async function getData(page, word) {
    var ws = fs.createWriteStream('careefouruae.csv');
    var data = fs.readFileSync("xpath.csv", "utf8");
    data = data.split("\n");
    for (let i in data) {
        data[i] = data[i].split(",");
    }
    await page.goto('https://www.carrefouruae.com/', { waitUntil: 'networkidle2', timeout: 0 });
    let search = await page.waitForXPath(`//input[@class="css-12uq56f"]`);
    await search.type(word);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    await scrollPageToBottom(page);
    i = 0;
    while (1) {
        try {
            await page.waitForXPath(data[0]);
            let title_ele = await page.$x(data[0]);
            let title = await page.evaluate(h1 => h1.textContent, title_ele[i]);
            await page.waitForXPath(data[1]);
            let price_ele = await page.$x(data[1]);
            let price = await page.evaluate(pr1 => pr1.textContent, price_ele[i]);
            i += 1
            scrapedData.push({
                Title: title,
                Price: price
            });
        } catch (e) {
            break;
        }
    }
    csv.write(scrapedData,{headers:true}).pipe(ws);
    return scrapedData;
}

