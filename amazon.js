const puppeteer = require('puppeteer');
//const xlsx = require("xlsx");


async function getPageData(url, page) {
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    await page.waitForSelector('.beauty.en_IN', { visible: true, timeout: 0 });
    const title = await page.$eval('#titleSection h1 > span', span => span.innerText, { visible: true });
    const brand = await page.$eval('#poExpander > div.a-expander-content.a-expander-partial-collapse-content > div > table > tbody > tr:nth-child(3) > td.a-span9 > span', span => span.textContent, { visible: true });
    const rating = await page.$eval('#acrPopover > span.a-declarative > a > i.a-icon.a-icon-star.a-star-4-5 > span', span => span.textContent, { visible: true });
    const mrp = await page.$eval('#corePrice_desktop > div > table > tbody > tr:nth-child(1) > td.a-span12.a-color-secondary.a-size-base > span.a-price.a-text-price.a-size-base > span:nth-child(2)', span => span.textContent, { visible: true });
    const rate = await page.$eval('#corePrice_desktop > div > table > tbody > tr:nth-child(2) > td.a-span12 > span.a-price.a-text-price.a-size-medium.apexPriceToPay > span.a-offscreen', span => span.textContent, { visible: true });
    const imageLink = await page.$eval('#landingImage', img => img.src, { visible: true });
    const availability = await page.$eval('#availability > span', span => span.innerText, { visible: true });
    const aboutThisItem = await page.$eval('#feature-bullets > ul', li => li.textContent, { visible: true });


    return {
      Title: title,
      Brand: brand,
      Rating: rating,
      MRP: mrp,
      Rate: rate,
      Image_link: imageLink,
      Availability: availability,
      About_this_item: aboutThisItem
    }


  } catch (err) {
    console.error("Hidden");
  }

};





async function getlinks() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://www.amazon.in/s?k=moisturizer+for+face&crid=3LWHPNZCYFLAQ&sprefix=moi%2Caps%2C193&ref=nb_sb_ss_ts-doa-p_1_3', { waitUntil: 'networkidle2', timeout: 0 });
  const links = await page.$$eval('.a-link-normal.s-no-outline', allAs => allAs.map(a => a.href));
  await browser.close();
  return links;
};



async function main() {
  const allLinks = await getlinks();
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  var scrapedData = [];

  for (let link of allLinks) {
    console.log(link);
    const data = await getPageData(link, page);
    scrapedData.push(data);
    console.log(scrapedData);
  }

  // scrapedData = scrapedData.filter(function (element) {
  //   return element !== undefined;
  // });
  // const wb = xlsx.utils.book_new();
  // const ws = xlsx.utils.json_to_sheet(scrapedData);
  // xlsx.utils.book_append_sheet(wb, ws);
  // xlsx.writeFile(wb, "amazon.xlsx");


} main();



