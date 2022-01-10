const puppeteer = require ('puppeteer');
(async function main (){
    try{
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://www.nseindia.com/get-quotes/equity?symbol=SBIN', {waitUntil: 'networkidle2', timeout: 0});
        await page.waitForSelector('.securityinfo');
        const lis = await page.$$('.securityinfo');
        for(const i of lis){
            var p = await i.$eval('h2', h2 => h2.innerText);
            var header = await i.$eval('#securityInfo thead > tr', tr => tr.innerText);
            var dis = await i.$eval('#securityInfo tbody > tr', tr => tr.innerText);
            console.log({p,header,dis});
        }
        await browser.close();

    }catch(e){
        console.log('error',e);
    }
})();