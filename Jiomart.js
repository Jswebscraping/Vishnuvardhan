const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('fast-csv');

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.jiomart.com/', { waitUntil: 'networkidle2', timeout: 0 });
    let drop_down = await page.waitForXPath('(//*[@id="nav_link_61"])');
    await drop_down.click();
    await page.waitForSelector('#nav_link_62');
    await page.evaluate(() => document.querySelector('#nav_link_62').click());

    i = 1;
    var scrapedData = [];
    var ws = fs.createWriteStream('Jiomart.csv');

    while (1) {
        try {
            await page.waitForXPath(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div[${i}]/div/a/span[4]`, { timeout: 3000 });
            let title_ele = await page.$x(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div[${i}]/div/a/span[4]`);
            let title = await page.evaluate(h1 => h1.textContent, title_ele[0]);
            await page.waitForXPath(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div[${i}]/div/span[2]/span`, { timeout: 3000 });
            let price_ele = await page.$x(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div[${i}]/div/span[2]/span`);
            let price = await page.evaluate(pr1 => pr1.textContent, price_ele[0]);
            i += 1;
            scrapedData.push({
                Title: title,
                Price: price
            });
            //console.log("Title -", title, "\nPrice -", price);
        }
        catch (e) {
            break;
        }
    }

    var buttons = ['//*[@id="sort_container"]/button[2]', '//*[@id="sort_container"]/button[3]', '//*[@id="sort_container"]/button[4]'];
    for (const button of buttons) {
        let button_click = await page.waitForXPath(button);
        await button_click.click();
        //console.log('button clicked');
        j = 1;
        while (1) {
            try {
                await page.waitForXPath(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div/div/ol/li[${j}]/div/a/span[3]`, { timeout: 3000 });
                let title_ele1 = await page.$x(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div/div/ol/li[${j}]/div/a/span[3]`);
                let title1 = await page.evaluate(h1 => h1.textContent, title_ele1[0]);
                await page.waitForXPath(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div/div/ol/li[${j}]/div/span[2]/span`, { timeout: 3000 });
                let price_ele1 = await page.$x(`/html/body/div[1]/main/div[2]/div[2]/div[4]/div[2]/div/div/div/div/div/ol/li[${j}]/div/span[2]/span`);
                let price1 = await page.evaluate(pr1 => pr1.textContent, price_ele1[0]);
                j += 1;
                scrapedData.push({
                    Title: title1,
                    Price: price1
                });
                //console.log("Title -", title1, "\nPrice -", price1);
            }
            catch (e) {
                break;
            }
        }
    }
    csv.write(scrapedData, { headers: true }).pipe(ws);
    console.log("Completed");
    await browser.close();

} main();