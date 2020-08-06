var crypto = require('crypto');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json())


const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(256/8).toString('hex');
const IV_LENGTH = 16;

app.all('*',async(req,res)=>{
    //encryption for testing
    var encoded = encrypt(JSON.stringify(req.body))

    //decryption
    var decoded = decrypt(encoded)
    res.redirect(307,'http://localhost:3001/private'+req.path+'?data='+decoded);
})

function decrypt(text) {
    const [iv, encryptedText] = text.split(':').map(part => Buffer.from(part, 'hex'));
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

app.listen(3002);
