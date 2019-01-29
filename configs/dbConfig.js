const mysql = require('mysql')
const pool  = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'henry_db',
})

module.exports = pool