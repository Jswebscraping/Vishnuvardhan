 const fetch = require('node-fetch');
const MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
let db, grofer
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
        db = client.db("grofer")
        grofer = db.collection("grofer");
//var obj;
(async () => {
    const response = await fetch('https://grofers.com/v6/merchant/29815/product/437996/', {
        method: 'GET',
        credentials: 'true'
        });
        const product = await response.json();
        console.log(product);
        //obj = ({product})
        grofer.deleteMany({})
        grofer.insertOne(product)
    })();
})
