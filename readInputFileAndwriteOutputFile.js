var fs = require('file-system');

var readInputFile = function (successCallback) {
  var path = './input.json'
  fs.readFile(path, 'utf8', (err, data) => {
    if(err) {
      return console.log(err);
    }
    else if(data) {
      return successCallback(JSON.parse(data));
    }
  })
}

var writeOutputFile = function (outputData) {
  var path = './resultset.json'
  fs.writeFile(path, JSON.stringify(outputData), (err) => {
    if(err) {
      return console.log(err);
    }
    else {
      return console.log("output written into" + path);
    }
  })
}

module.exports = { readInputFile, writeOutputFile };