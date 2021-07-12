const express = require('express');
const axios = require('axios');
const fs = require('fs');
const writeFromObj = require("./writeFromObj");

const PORT = 3000;
const DEST_PORT = 3020;

const app = express();

app.use('/', function (req, res) {
  axios({
    method: req.method,
    url: `http://${req.hostname}:${DEST_PORT}${req.path}`,
    headers: req.headers,
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

      writeFromObj({ request: simplifiedRequest, response: simplifiedResponse }, "./records");

      res.status(response.status)
      res.set(response.headers)
      res.send(response.data)
    })
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})

