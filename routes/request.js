var express = require('express');
var data = require('../model/request_model');
var router = express.Router();

/* GET users listing. */

router.get('/requests_list', function(req, res) {
  data.requests_list(req.body.user_id, function(result) {
    return res.json(result);
  });
});

router.post('/create_request', function(req, res) {
  // data.create_request(req.body.user, req.body.password, function(result) {
  //   return res.json(result);
  // });

  // for testing
  data.create_request("1", ["2", "3"], "dinner", "123123", "restaurant", "comment", function(result) {
    return res.json(result);
  });
});

router.post('/handle_request', function(req, res) {
  var nvalidU = data.checkUser(req.body.user);
  var nvalidP = data.checkPwd(req.body.password);
  if (nvalidP) return res.json({'errCode': nvalidP});
  if (nvalidU) return res.json({'errCode': nvalidU});

  data.add(req.body.user, req.body.password, function(result) {
    return res.json(result);
  })
});

module.exports = router;
