const fs = require('fs');

function writeFromObj(data, directory) {
  //store req with response by stringify request & response data (while handling the circular references that JSON.stringify doesnt like)

  var cache = [];
  const stringifiedData = JSON.stringify(data, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      // Duplicate reference found, discard key
      if (cache.includes(value)) return;
      // Store value in our collection 
      cache.push(value);
    }
    return value;
  });
  cache = null; // Enable garbage collection

  //title could be a timestamp
  //Store stringified request & response data as a file
  fs.writeFile(`${directory}/${Math.floor(Math.random() * 10000)}.json`, stringifiedData, function (err) {
    if (err) return console.log(err);
  });
}

module.exports = writeFromObj