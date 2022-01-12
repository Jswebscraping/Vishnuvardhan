const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
 try{
    let  product=[]
    const urls = ['https://www.loblaws.ca/search?search-bar=Dry%20puppy%20food',
    'https://www.loblaws.ca/search?search-bar=baby%20food%27',
    'https://www.loblaws.ca/search?search-bar=Chocolate%20icecream']
        const url = urls[0];
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(`${url}`, {waitUntil: 'networkidle2', timeout:0});
        await page.waitForSelector('.product-tile-group__list__item');
        const lis = await page.$$('.product-tile-group__list__item');
        for(i=0;i<=15;i++)
        {
           var title = await lis[i].$eval('.product-tile__details__info__name', h3 => h3.innerText);
            var price = await lis[i].$eval('.selling-price-list', span => span.innerText);
            var comparprice= await lis[i].$eval('.comparison-price-list', span => span.innerText);
            var resultp = {title,price,comparprice};
            console.log("puppyfood",resultp);
            
            
        }
        const url1 = urls[1];
        await page.goto(`${url1}`, {waitUntil: 'networkidle2', timeout:0});
        await page.waitForSelector('.product-tile-group__list__item');
        const lis1 = await page.$$('.product-tile-group__list__item');
        for(i=0;i<=47;i++)
        {
            var title = await lis1[i].$eval('.product-tile__details__info__name', h3 => h3.innerText);
            var price = await lis1[i].$eval('.selling-price-list', span => span.innerText);
            var comparprice= await lis1[i].$eval('.comparison-price-list', span => span.innerText);
            var resultb = {title,price,comparprice};
            console.log("babyfood",resultb);
            
        }
        const url2 = urls[2];
        await page.goto(`${url2}`, {waitUntil: 'networkidle2', timeout:0});
        await page.waitForSelector('.product-tile-group__list__item');
        const lis2 = await page.$$('.product-tile-group__list__item');
        for(i=0;i<=47;i++)
        {
            var title = await lis2[i].$eval('.product-tile__details__info__name', h3 => h3.innerText);
            var price = await lis2[i].$eval('.selling-price-list', span => span.innerText);
            var comparprice= await lis2[i].$eval('.comparison-price-list', span => span.innerText);
            var resulti = {title,price,comparprice};
            console.log("icecream:",resulti);


            fs.appendFile('products.json', JSON.stringify({resultp,resultb,resulti}), (err) => {
                if (err) {
                    throw err;
                }
            })
            
            await browser.close();
        }
    }

        
    //     product.push({
    //       puppy:resultp,
    //       baby:resultb,
    //       ice:resulti,
    //     });
     
    //  const j2cp = new json2csv()
    //  const csv = j2cp.parse(product);
 
    //  fs.writeFileSync("./loblaws.csv", csv, "utf-8")
    catch(e){
        console.log('error',e);
    }

    })();
    // const lis = await page.$$('.product-grid__results__products'); ('.product-tile__details__info__name', h3 => h3.innerText);