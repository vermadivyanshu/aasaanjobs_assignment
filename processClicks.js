const MAX_CLICK_COUNT = 10;
var convertClicksToClicksPerIp = function (clicks) {
  var clicksPerIp = {}
  clicks.forEach(click => {
    if(clicksPerIp[click.ip]) {
      clicksPerIp[click.ip].push(click);
    }
    else {
      clicksPerIp[click.ip] = [click];
    }
  });
  return clicksPerIp;
}

var removeClicksWithCountMoreThanMax = function (clicksObj, maxCount = MAX_CLICK_COUNT) {
  var clickKeys = Object.keys(clicksObj);
  clickKeys.forEach(key => {
    if(clicksObj[key].length >= maxCount) {
      delete clicksObj[key];
    }
  });
}

var findMaxAmountAndLatestTimestampPerHourForIp = function (clicksForIp) {
  var maxAmountPerHour = {};
  var timeStampPerHour = {};
  var hours, parsedDate;
  clicksForIp.forEach(click => {
    parsedDate = new Date(click.timestamp);
    hours = parsedDate.getHours();
    if(!maxAmountPerHour[hours]) {
      maxAmountPerHour[hours] = click.amount;
      timeStampPerHour[hours] = click.timestamp;
    }
    else if(maxAmountPerHour[hours] < click.amount) {
      maxAmountPerHour[hours] = click.amount;
      timeStampPerHour[hours] = click.timestamp;
    }
    else if(maxAmountPerHour[hours] == click.amount) {
      if(parsedDate < new Date(timeStampPerHour[hours]))
        timeStampPerHour[hours] = click.timestamp;
    }
  });
  return {
    maxAmountPerHour,
    timeStampPerHour
  };
}

var convertToClicksArray = function(ip, maxAmountPerHour, timeStampPerHour) {
  var keys = Object.keys(maxAmountPerHour);
  var result = []
  keys.forEach(key => {
    result.push({
      ip,
      amount: maxAmountPerHour[key],
      timestamp: timeStampPerHour[key]
    });
  });
  return result;
}

var findMaxAmountForClicksPerIp = function(clicksPerIp) {
  var ips = Object.keys(clicksPerIp);
  var results = [], clicksForIp;
  ips.forEach(ip => {
    ({ maxAmountPerHour, timeStampPerHour } = findMaxAmountAndLatestTimestampPerHourForIp(clicksPerIp[ip]))
    clicksForIp = convertToClicksArray(ip, maxAmountPerHour, timeStampPerHour);
    results.push(...clicksForIp);
  });
  return results;
}

var processClicks = function(clicks) {
  console.log("* processing clicks *")
  var clicksPerIp = convertClicksToClicksPerIp(clicks);
  console.log("* removing clicks which are more than " + MAX_CLICK_COUNT + " *")
  removeClicksWithCountMoreThanMax(clicksPerIp);
  console.log("* find max amount per hour per IP *")
  return findMaxAmountForClicksPerIp(clicksPerIp);
}


module.exports = {
  processClicks,
  findMaxAmountForClicksPerIp,
  convertToClicksArray,
  convertClicksToClicksPerIp,
  removeClicksWithCountMoreThanMax,
  findMaxAmountAndLatestTimestampPerHourForIp
};