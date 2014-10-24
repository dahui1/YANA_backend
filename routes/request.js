var express = require('express');
var data = require('../model/request_model');
var router = express.Router();

/* GET users listing. */

router.get('/request_list', function(req, res) {
  data.requestList(req.body.user_id, function(result) {
    return res.json(result);
  });
});

router.post('/create_request', function(req, res) {
  // data.create_request(req.body.user, req.body.password, function(result) {
  //   return res.json(result);
  // });

  // for testing
  data.createRequest("1", ["2", "3"], "dinner", "123123", "restaurant", "comment", function(result) {
    return res.json(result);
  });
});

router.post('/handle_request', function(req, res) {
  // TO-DO: IMPLEMENT THIS
});

module.exports = router;
