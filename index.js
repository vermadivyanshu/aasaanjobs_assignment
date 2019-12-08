var readInputFile = require('./readInputFileAndwriteOutputFile.js').readInputFile;
var writeOutputFile = require('./readInputFileAndwriteOutputFile.js').writeOutputFile;
var processClicks = require('./processClicks.js').processClicks;

function main() {
  var successCallback = (clicks) => {
    var output = processClicks(clicks);
    console.log("* writing output into resultset.json *")
    writeOutputFile(output);
  }
  readInputFile(successCallback);
}
main();