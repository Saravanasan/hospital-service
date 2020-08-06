var express = require('express');
var bodyParser = require('body-parser')
var crypto = require('crypto');
const bcrypt = require('bcrypt');
var moment = require('moment');

var db = require('./database');
const { encode } = require('querystring');

var app = express();
app.use(bodyParser.json())

const saltRounds = 10;
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(256/8).toString('hex');
const IV_LENGTH = 16;

function encrypt(data) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

app.post('/private/register',async(req,res)=>{
  var data = JSON.parse(req.query.data)
  var password = await bcrypt.hash(data.password, saltRounds);
  var ts = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
  var sql = `INSERT INTO register (username, email, password, creation_ts) VALUES ('${data.username}', '${data.email}', '${password}', '${ts}' )`;
  db.con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    res.status(200).send('Success');
  });
})

app.get('/private/get/user',async(req,res)=>{
  var sql = `SELECT username,email,creation_ts FROM register`;
  db.con.query(sql, async function (err, result) {
    if (err) throw err;
    var response = await encrypt(result.toString());
    res.status(200).json({data:response});
  });
})

app.get('/private/get/hospital',async(req,res)=>{
  var sql = `SELECT * FROM hospital`;
  db.con.query(sql, async function (err, result) {
    if (err) throw err;
    var response = await encrypt(result.toString());
    res.status(200).json({data:response});
  });
})

app.listen(3001);