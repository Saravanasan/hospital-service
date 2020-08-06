var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
      database: "health_service"
  });

con.connect(function(err) {
if (err) throw err;
console.log("Connected!");
});


module.exports = {con};