const text = `Shelf Life
7 Days
Unit
1 kg
Shelf Life
7 Days
Manufacturer Details
9th floor, Wework Building, Outer Ring Road, Near central mall, Bellandur, Bangalore-560103
Marketed By
63 Ideas Infolabs Pvt. Ltd
Customer Care Details
Customer Care No. 1-800-208-2400
Customer Care Mail Id: customercare@handsontrade.com
Customer Care No. 1-800-208-8888
Customer Care Mail Id: info@grofers.com
Disclaimer
Every effort is made to maintain the accuracy of all information. However, actual product packaging and materials may contain more and/or different information. It is recommended not to solely rely on the information presented.`
const regexPattern = /(manufacturer\sdetails\s(.*))/gi;
const result = text.match(regexPattern);
console.log("Result -",result);
