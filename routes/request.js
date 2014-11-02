var express = require('express');
var data = require('../model/request_model');
var user = require('../model/user_model');
var router = express.Router();

/* GET users listing. */

router.get('/request_list/:user_id', user.isLoggedIn, function(req, res) {
  data.getRequests(req.param('user_id'), function(result) {
    return res.json(result);
  });
});

router.post('/create_request', user.isLoggedIn, function(req, res) {
  data.createRequest(
    req.body.user_id,
    req.body.username,
    req.body.invitations,
    req.body.meal_type,
    req.body.meal_time,
    req.body.restaurant,
    req.body.comment,
    function(result) { return res.json(result); }
  );
});

router.post('/handle_request', user.isLoggedIn, function(req, res) {
  data.handleRequest(req.body.user_id, req.body.request_id, req.body.action, function(result) {
    return res.json(result);
  });
});

module.exports = router;
