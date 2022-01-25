const puppeteer = require('puppeteer');
const request = require("request");
const fs = require('fs');
const result = [];
request({
  url: 'https://covid19-api.com/country?name=India&format=json',
   json: true
  },(err, response, body) => {
    console.log(body);
    result.push(body);
    fs.appendFile('covidDetails.json', JSON.stringify(result), (err) =>{
      if(err){
        throw err;
      }
    })
  });