var express = require('express');
var data = require('../model/user_model');
var router = express.Router();

/* GET users listing. */

router.get('/userlist', function(req, res) {
  data.allusers(function(result) {
    return res.json(result);
  });
});

router.post('/login', function(req, res) {
  data.login(req.body.user, req.body.password, function(result) {
    return res.json(result);
  });
});

router.post('/search_users_by_id', function(req, res) {
  data.getUserById(req.body.user_id, function(result) {
    return res.json(result);
  });
});

router.post('/search_users_by_name', function(req, res) {
  data.getUserByName(req.body.user_name, function(result) {
    return res.json(result);
  });
});

router.post('/create_user', function(req, res) {
  var nvalidU = data.checkUser(req.body.user);
  var nvalidP = data.checkPwd(req.body.password);
  if (nvalidP) return res.json({'errCode': nvalidP});
  if (nvalidU) return res.json({'errCode': nvalidU});

  data.add(req.body.user, req.body.password, function(result) {
    return res.json(result);
  })
});

module.exports = router;
