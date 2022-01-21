const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('fast-csv');

const get_price = async (page, i) => {
    try {
        await page.waitForXPath(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[3]/div/div[1]/h4/span/span[2]`, { timeout: 5000 });
        let price_ele = await page.$x(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[3]/div/div[1]/h4/span/span[2]`);
        let price = await page.evaluate(pr1 => pr1.textContent, price_ele[0]);
        return price;
    }
    catch (e) {
        try {
            await page.waitForXPath(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[3]/div/div[1]/h4/span[2]/span`, { timeout: 5000 });
            let price_ele = await page.$x(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[3]/div/div[1]/h4/span[2]/span`);
            let price = await page.evaluate(pr1 => pr1.textContent, price_ele[0]);
            return price;
        }
        catch (e) {
            return "error in price";
        }

    }
}

(async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.bigbasket.com/', { waitUntil: 'networkidle2', timeout: 0 });
    await page.type('#input', 'beverages');
    await page.click('#navbar-main > div > div.col-md-6.col-sm-12.col-xs-12.mb-pad-0.mb-zindex.search-bar > div > div');
    i = 1;
    var scrapedData = [];
    var ws = fs.createWriteStream('Bigbasket.csv');

    while (1) {
        try {
            await page.waitForXPath(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[1]`, { timeout: 3000 });
            let title_ele = await page.$x(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[1]`);
            let title = await page.evaluate(h1 => h1.textContent, title_ele[0]);
            let price = await get_price(page, i);
            i += 1;
            scrapedData.push({
                Title: title,
                Price: price
            });


        }
        catch (e) {
            try {
                i += 1;
                await page.waitForXPath(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[1]`, { timeout: 3000 });
                let title_ele = await page.$x(`//*[@id="dynamicDirective"]/product-deck/section/div[2]/div[4]/div[1]/div/div/div[2]/div/div[${i}]/product-template/div/div[4]/div[1]`);
                let title1 = await page.evaluate(h2 => h2.textContent, title_ele[0]);
                let price1 = await get_price(page, i);
                i += 1;
                scrapedData.push({
                    Title: title1,
                    Price: price1
                });



            }
            catch (e) {
                break;

            }

        }

    }
    csv.write(scrapedData, { headers: true }).pipe(ws);
    console.log("end");
    await browser.close();
}());