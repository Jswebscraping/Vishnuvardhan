const puppeteer = require('puppeteer');
const fs = require('fs');
(async function main (){
    try{
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://grofers.com/prn/eno-lemon-digestive-antacid/prid/10841', {waitUntil: 'networkidle2', timeout: 0});
        await page.waitForSelector('.css-1dbjc4n');
            var product_title = await page.$eval('.css-cens5h', div => div.innerText);
            var product_rate = await page.$eval('.css-901oao.r-cqee49.r-1b1savu.r-1b43r93.r-14yzgew.r-1d4mawv', div => div.innerText);
            var product_details = await page.$eval('.product-attributes--additional-properties', div => div.innerText);
            var result = {product_title,product_rate,product_details};
            console.log(result);

            fs.appendFile('output.json', JSON.stringify(result), (err) => {
                if (err) {
                    throw err;
                }
            })
            await browser.close();

    }catch(e){
        console.log('error',e);
    }
})();