const puppeteer = require('puppeteer');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let db, Loblaws
MongoClient.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) {
            console.error(err)
            return
        }
        db = client.db("Loblaws")
        Loblaws = db.collection("Loblaws");
        async function main() {
            var finalData = [];
            var data1 = fs.readFileSync("keywordloblaw.csv", "utf8");
            data1 = data1.split("\n");
            for (let i in data1) {
                data1[i] = data1[i].split(",");
            }
            for (let word of data1) {
                const browser = await puppeteer.launch({ headless: false });
                const page = await browser.newPage();
                const srpData = await getData(page, word);
                console.log(srpData);
                //Loblaws.deleteMany({})
                Loblaws.insertMany(srpData)
                await browser.close();
            }
        } main();
        
    })
async function getData(page, word) {
    await page.goto('https://www.loblaws.ca/', { waitUntil: 'networkidle2', timeout: 0 });
    let search = await page.waitForXPath(`//input[@class='search-input__input']`);
    await search.type(word);
    await page.keyboard.press('Enter');
    var scrapedData = [];
    var i;
    var data = fs.readFileSync("xpath.csv", "utf8");
    data = data.split("\n");
    for (let i in data) {
        data[i] = data[i].split(",");
    }
    try {
        for (i = 0; i <= 52; i++) {
            await page.waitForXPath(data[0]);
            let title_ele = await page.$x(data[0]);
            let title = await page.evaluate(h1 => h1.textContent, title_ele[i]);
            await page.waitForXPath(data[1]);
            let price_ele = await page.$x(data[1]);
            let price = await page.evaluate(pr1 => pr1.textContent, price_ele[i]);
            await page.waitForXPath(data[2]);
            let Comprice_ele = await page.$x(data[2]);
            let Comprice = await page.evaluate(pr1 => pr1.textContent, Comprice_ele[i]);
            //console.log("Title -", title, "\nPrice -", price, "\nComparison_price -", Comprice);
            scrapedData.push({
                Title: title,
                Price: price,
                Comparison_price: Comprice
            });
        }
    }
    catch (e) {
        
    }
return scrapedData;
}

