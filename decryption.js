var crypto = require('crypto');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json())

app.all('*',async(req,res)=>{
    //encryption for testing
    var mykey1 = crypto.createCipher('aes-128-cbc', 'secretkey');
    var mystr1 = mykey1.update(JSON.stringify(req.body), 'utf8', 'hex')
    mystr1 += mykey1.final('hex');

    var mykey = await crypto.createDecipher('aes-128-cbc', 'secretkey');
    var mystr = await mykey.update(mystr1, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    res.redirect(307,'http://localhost:3001/private'+req.path+'?data='+mystr)
})

app.listen(3002);