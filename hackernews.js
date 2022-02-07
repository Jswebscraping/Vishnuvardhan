const puppeteer= require('puppeteer');

(async() =>{
    
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage()
    await page.goto('https://news.ycombinator.com/',{waitUntil:'networkidle0' , timeout:0});
   await page.waitForSelector('.athing');
   const lis = await page.$$('.athing');   
for(i=0;i<=9;i++){
    var link = await lis[i].$eval('.titlelink', a => a.href);
    var links ={link};
    console.log(links)
}
await browser.close();
   
} )()