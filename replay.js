equire('dotenv').config()
const fs = require('fs');
const axios = require('axios')
const writeFromObj = require("./writeFromObj");
const { Client } = require('pg')
const client = new Client()
client.connect()

const DEST_URL = "http://localhost:3020"

//replace this with a database query
fs.readdir('records', { withFileTypes: true }, (err, files) => {
  if (err) {
    return console.log(err);
  }

  files.forEach(file => {
    fs.readFile(`./records/${file.name}`, 'utf8', function (err, contents) {
      if (err) {
        return console.log(err);
      }

      record = JSON.parse(contents);

      //wrap in a function to compare time of request sent and time of response received?
      axios({
        method: record.request.method,
        url: DEST_URL,
        body: record.request.body,
        headers: record.request.headers,
        validateStatus: function (status) {
          return status < 500; // Always resolve for status codes less than 500
        }
      })
        .catch(err => console.log(err))
        .then(response => {
          const simplifiedResponse = { status: response.status, headers: response.headers, body: response.data }
          writeFromObj({ origResponse: record.response, newResponse: simplifiedResponse }, "./comparisons")

          //future change: compare the responses and store the result of the comparison
        })
    });
  });
})
