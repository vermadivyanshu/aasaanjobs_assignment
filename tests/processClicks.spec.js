var expect = require('chai').expect;
var processClicksObj = require('../processClicks');

describe('removeClicksWithCountMoreThanMax', function() {
  it('should remove clicks in the clicksObj which are more than the max count', function() {
    var clicksObj = {
      '11.11.11.11': [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '11.11.11.11', timestamp: "3/11/2016 03:02:58", amount: 3.00}],
      '127.0.0.1': [{ip: '127.0.0.1', timestamp: "3/11/2016 01:02:58", amount: 4.00}, {ip: '127.0.0.1', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '127.0.0.1', timestamp: "3/11/2016 03:02:58", amount: 4.00}]
    }
    processClicksObj.removeClicksWithCountMoreThanMax(clicksObj, 3);
    expect(clicksObj['127.0.0.1']).to.not.exist
    expect(clicksObj['11.11.11.11']).to.eql([{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '11.11.11.11', timestamp: "3/11/2016 03:02:58", amount: 3.00}])
  })
})

describe('convertClicksToClicksPerIp', function() {
  it('should convert the clicks array into an object with ip as key and array', function() {
    var clicks = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '11.11.11.11', timestamp: "3/11/2016 03:02:58", amount: 3.00},
    {ip: '127.0.0.1', timestamp: "3/11/2016 01:02:58", amount: 4.00}];
    var result = {
      '11.11.11.11': [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '11.11.11.11', timestamp: "3/11/2016 03:02:58", amount: 3.00}],
      '127.0.0.1': [{ip: '127.0.0.1', timestamp: "3/11/2016 01:02:58", amount: 4.00}]
    }
    expect(processClicksObj.convertClicksToClicksPerIp(clicks)).to.eql(result);
  });
})

describe('findMaxAmountAndLatestTimestampPerHourForIp', function () {
  context('when there is only on record for every hour', function() {
    it('should return an object with amount and timestamp per hour', function() {
      var clicksForIp = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00},
      {ip: '11.11.11.11', timestamp: "3/11/2016 03:02:58", amount: 3.00}];
      var result = processClicksObj.findMaxAmountAndLatestTimestampPerHourForIp(clicksForIp);
      var expectedResponse = {
        maxAmountPerHour: {'2': 4, '3': 3 },
        timeStampPerHour: {'2': "3/11/2016 02:02:58", '3': "3/11/2016 03:02:58"}
      }
      expect(result.maxAmountPerHour).to.eql(expectedResponse.maxAmountPerHour)
      expect(result.timeStampPerHour).to.eql(expectedResponse.timeStampPerHour)

    })
  })
  context('when there are two records for an hour, with different amount', function() {
    it('it should select the one with the max amount', function() {
      var clicksForIp = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00},
      {ip: '11.11.11.11', timestamp: "3/11/2016 02:06:58", amount: 8.00}];
      var result = processClicksObj.findMaxAmountAndLatestTimestampPerHourForIp(clicksForIp);
      var expectedResponse = {
        maxAmountPerHour: {'2': 8 },
        timeStampPerHour: {'2': "3/11/2016 02:06:58"}
      };
      expect(result.maxAmountPerHour).to.eql(expectedResponse.maxAmountPerHour);
      expect(result.timeStampPerHour).to.eql(expectedResponse.timeStampPerHour);
      
    });
  });
  context('when there are two records for an hour, with same amount', function() {
    it('it should the earliest click', function() {
      var clicksForIp = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00},
      {ip: '11.11.11.11', timestamp: "3/11/2016 02:06:58", amount: 4.00}];
      var result = processClicksObj.findMaxAmountAndLatestTimestampPerHourForIp(clicksForIp);
      var expectedResponse = {
        maxAmountPerHour: {'2': 4 },
        timeStampPerHour: {'2': "3/11/2016 02:02:58"}
      };
      expect(result.maxAmountPerHour).to.eql(expectedResponse.maxAmountPerHour)
      expect(result.timeStampPerHour).to.eql(expectedResponse.timeStampPerHour)
      
    });
  });
});

describe('convertToClicksArray', function() {
  it('should convert the ip, maxAmountPerHour, timestampPerHour into clicks array of objects', function(){
    var expectedResult = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}];
    var maxAmountPerHour = {'2': 4 };
    var timeStampPerHour = {'2': "3/11/2016 02:02:58"};
    var result = processClicksObj.convertToClicksArray('11.11.11.11', maxAmountPerHour, timeStampPerHour);
    expect(result).to.eql(expectedResult);

  });
});

describe('findMaxAmountForClicksPerIp', function() {
  it('should return an array of clicks containing the most expensive clicks per hour for all ips', function() {
    var clicksObj = {
      '11.11.11.11': [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '11.11.11.11', timestamp: "3/11/2016 02:08:58", amount: 4.00}],
      '127.0.0.1': [{ip: '127.0.0.1', timestamp: "3/11/2016 02:06:58", amount: 4.00}, {ip: '127.0.0.1', timestamp: "3/11/2016 02:10:58", amount: 8.00}]
    };
    var result = processClicksObj.findMaxAmountForClicksPerIp(clicksObj);
    var expectedResponse = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00},
    {ip: '127.0.0.1', timestamp: "3/11/2016 02:10:58", amount: 8.00}];
    expect(result).to.eql(expectedResponse);
  });
});

describe('processClicks', function() {
  it('should process the clicks array and return the subset of the clicks with most expensive click per hour per ip', function () {
    var clicks = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '11.11.11.11', timestamp: "3/11/2016 02:08:58", amount: 4.00},
    {ip: '127.0.0.1', timestamp: "3/11/2016 02:06:58", amount: 4.00}, {ip: '127.0.0.1', timestamp: "3/11/2016 02:10:58", amount: 8.00}];
    var result = [{ip: '11.11.11.11', timestamp: "3/11/2016 02:02:58", amount: 4.00}, {ip: '127.0.0.1', timestamp: "3/11/2016 02:10:58", amount: 8.00}];
    expect(processClicksObj.processClicks(clicks)).to.eql(result);
  })
})