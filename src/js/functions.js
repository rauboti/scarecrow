// => node modules
const debug = require('debug')('app:dbfunctions');
const https = require('https');
const parseString = require('xml2js').parseString;

module.exports = {
  createID: function() {
    function rndLtr() {
      var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return rndLtr() + rndLtr() + rndLtr() + rndLtr() + '-' + rndLtr() + rndLtr() +  rndLtr() + rndLtr() + rndLtr() + rndLtr() + rndLtr() + '-' + rndLtr() + rndLtr() + rndLtr() + rndLtr() + rndLtr();
  },
  getWeekday: (n) => {
    var d = new Array(7);
    d[0] = "Sun"; d[1] = "Mon"; d[2] = "Tue"; d[3] = "Wed"; d[4] = "Thu"; d[5] = "Fri"; d[6] = "Sat";
    return d[n];
  },
  xmlToJson: function(url, callback) {
    var req = https.get(url, function(res) {
      var xml = '';
      res.on('data', function(data) { xml += data; });
      res.on('error', function(err) { callback(err, null); });
      res.on('timeout', function(err) { callback(err, null); });
      res.on('end', function() {
        parseString(xml, function(err, result) { callback(null, result); });
      });
    });
  }
}
