const express = require('express')
const app = express()
const port = 3020

app.disable('etag'); //disabling express from responding with 304. learned from:
//https://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code

app.get('/*', (req, res) => {
  console.log('Get received')
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})