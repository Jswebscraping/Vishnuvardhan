const puppeteer = require('puppeteer');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let db, amazon
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
        db = client.db("amazon")
        amazon = db.collection("amazon");
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
                amazon.insertMany(srpData)
                await browser.close();
            }
        } main();

    })
    async function getData(page, word) {
        await page.goto('https://www.amazon.in/', { waitUntil: 'networkidle2', timeout: 0 });
        let search = await page.waitForXPath(`//*[@id="twotabsearchtextbox"]`);
        await search.type(word);
        await page.keyboard.press('Enter');
        var words = word.replaceAll(' ', '+');
        const url ="https://www.amazon.in/";
        var scrapedData = [];
        var data = fs.readFileSync("xpath.csv", "utf8");
        data = data.split("\n");
        for (let i in data) {
            data[i] = data[i].split(",");
        }
        j = 2;
        while (1) {
            try {
                i = 0;
                while (1) {
                    try {
                        await page.waitForXPath(data[0]);
                        let title_ele = await page.$x(data[0]);
                        let title = await page.evaluate(h1 => h1.textContent, title_ele[i]);
                        await page.waitForXPath(data[1]);
                        let price_ele = await page.$x(data[1]);
                        let price = await page.evaluate(pr1 => pr1.textContent, price_ele[i]);
                        i += 1;
                        scrapedData.push({
                            Title: title,
                            Price: price
                        });
                    } catch (e) {
                        break;
                    }
                }
                try {
                    if(j<=7){
                    await page.goto(`${url}s?k=${words}&page=${j}&ref=sr_pg_${j}`)
                    j+=1;
                    }
                    else{
                        break;
                    }
                }
                catch (e) {
                    break;
                }
            }
            catch (e) {
                
            }
        }
        return scrapedData;
    
    }

