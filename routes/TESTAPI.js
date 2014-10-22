var express = require('express');
var process = require('child_process');
var fs = require('fs'); 
var router = express.Router();

router.post('/unit_tests', function(req, res) {
  var str = fs.realpathSync('.'); 
  process.exec('mocha ' + str + '/tests/',
    function (error, stdout, stderr) {
      if (error !== null) {
        console.log('exec error: ' + error);
        return ("error");
      }

      var str = stdout.replace(/\n\n\n/g, "\n\r").replace(/\n\n/g, "\n\r").replace(/\u001b\[.*?m/g, '');
      var strs = str.split("\n\r");
      var result = strs[strs.length - 2];
      var count = parseInt(result.substring(0, result.indexOf("passing")).replace(/ /g, ''));

      if (stderr.length == 0) {
        res.json({nrFailed: 0, output: str.replace(/[\u0080-\uFFFF]/g, function(m) {
          return "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
        }), totalTests: count});
      } else {
        var errors = stderr.replace(/\n\n\n/g, "\n\r").replace(/\n\n/g, "\n\r").replace(/\u001b\[.*?m/g, '');
        var strsErrors = errors.split("\n\r");
        var failing = strsErrors[0];
        var fails = parseInt(failing.substring(0, failing.indexOf("failing")).replace(/ /g, ''));
        res.json({nrFailed: fails, output: (str + errors).replace(/[\u0080-\uFFFF]/g, function(m) {
          return "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
        }), totalTests: count + fails});
      }
    });
  });

module.exports = router;
