const text = "https://www.chemistwarehouse.co.nz/buy/1159/betadine-sore-throat-ready-to-use-120ml";
const regexPattern = /[0-9]{4}/g;
const result = text.match(regexPattern);
console.log("Result -",result);