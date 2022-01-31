const puppeteer = require("puppeteer")
const mongo = require("mongodb").MongoClient

const url = "mongodb://localhost:27017"
let db, details
var scrapedData = [];

mongo.connect(
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
        db = client.db("details")
        details = db.collection("details");
        (async () => {
            const browser = await puppeteer.launch({ headless: false })
            const page = await browser.newPage()
            await page.goto('https://www.flipkart.com/', { waitUntil: 'networkidle2', timeout: 0 });
            let search = await page.waitForXPath('//*[@id="container"]/div/div[1]/div[1]/div[2]/div[2]/form/div/div/input');
            await search.type('chocolate');
            await page.waitForSelector('#container > div > div._1kfTjk > div._1rH5Jn > div._2Xfa2_ > div._1cmsER > form > div > button');
            await page.evaluate(() => document.querySelector('#container > div > div._1kfTjk > div._1rH5Jn > div._2Xfa2_ > div._1cmsER > form > div > button').click());
            i = 2;
            while (1) {
                try {
                    for (j = 1; j <= 4; j++) {
                        await page.waitForXPath(`//*[@id="container"]/div/div[3]/div[1]/div[2]/div[${i}]/div/div[${j}]/div/a[2]`, { timeout: 3000 });
                        let title_ele = await page.$x(`//*[@id="container"]/div/div[3]/div[1]/div[2]/div[${i}]/div/div[${j}]/div/a[2]`);
                        let title = await page.evaluate(h1 => h1.getAttribute("title"), title_ele[0]);
                        await page.waitForXPath(`//*[@id="container"]/div/div[3]/div[1]/div[2]/div[${i}]/div/div[${j}]/div/a[3]/div/div[1]`, { timeout: 3000 });
                        let price_ele = await page.$x(`//*[@id="container"]/div/div[3]/div[1]/div[2]/div[${i}]/div/div[${j}]/div/a[3]/div/div[1]`);
                        let price = await page.evaluate(pr1 => pr1.textContent, price_ele[0]);
                        try {
                            await page.waitForXPath(`/html/body/div[1]/div/div[3]/div[1]/div[2]/div[${i}]/div/div[${j}]/div/div[2]/span[1]/div`, { timeout: 3000 });
                            let rating_ele = await page.$x(`/html/body/div[1]/div/div[3]/div[1]/div[2]/div[${i}]/div/div[${j}]/div/div[2]/span[1]/div`);
                            let rating = await page.evaluate(rat => rat.textContent, rating_ele[0]);
                            //console.log("title -", title, "\nprice -", price, "\nRating -", rating);
                            scrapedData.push({
                                Title: title,
                                Price: price,
                                Rating: rating
                            });
                        }
                        catch (e) {
                            //console.log("title -", title, "\nprice -", price, "\nRating - unavailable");
                            scrapedData.push({
                                Title: title,
                                Price: price,
                                Rating: "unavailable"
                            });

                        }

                    }
                    i += 1;

                }
                catch (e) {
                    break;
                }
            }
            console.log(scrapedData)
            details.deleteMany({})
            details.insertMany(scrapedData)
            await browser.close()
        })()
    }
)