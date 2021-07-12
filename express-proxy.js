require('dotenv').config()
const express = require('express');
const axios = require('axios');
const { stringifyCircular } = require("./writeFromObj");
const { Client } = require('pg')
const client = new Client()
client.connect()

const PORT = 3000;
const DEST_PORT = 3020;

const app = express();


app.use('/', function (req, res) {

  const requestTime = Date.now();
  axios({
    method: req.method,
    url: `http://${req.hostname}:${DEST_PORT}${req.path}`,
    headers: req.headers,
    //is req.body "undefined" by default?
    body: req.body,
    validateStatus: function (status) {
      return status < 500; // Always resolve for status codes less than 500
    }
  })
    .catch(error => {
      console.log(error)
    })
    .then((response) => {
      //future change: currently, does not differentiate between responses to different methods (GET vs POST, PUT)

      const simplifiedRequest = { method: req.method, url: `http://${req.hostname}:8080${req.path}`, headers: req.headers, body: req.body }
      const simplifiedResponse = { status: response.status, headers: response.headers, body: response.data }

      //writeFromObj({ request: simplifiedRequest, response: simplifiedResponse }, "./records");
      const elapsedTime = Date.now() - requestTime;
      client.query('INSERT INTO records (request, origresponse, origlatency) VALUES ($1, $2, $3)', [stringifyCircular(simplifiedRequest), stringifyCircular(simplifiedResponse), elapsedTime])

      //need to include more in response?
      res.status(response.status)
      res.set(response.headers)
      res.send(response.data)
    })
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
