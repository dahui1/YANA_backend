var express = require('express');
var data = require('../model/user_model');
var router = express.Router();

/* GET users listing. */

router.get('/userlist', function(req, res) {
  data.allusers(function(result) {
    return res.json(result);
  });
});

router.post('/create_user', function(req, res) {
  var nvalidU = data.checkUser(req.body.username);
  var nvalidP = data.checkPwd(req.body.password);
  if (nvalidP) return res.json({'errCode': nvalidP});
  if (nvalidU) return res.json({'errCode': nvalidU});

  data.add(req.body.username, req.body.password, function(result) {
    return res.json(result);
  })
});

router.post('/login', function(req, res) {
  data.login(req.body.username, req.body.password, function(result) {
    return res.json(result);
  });
});

router.get('/search_users_by_id/', function(req, res) {
  return res.json({errCode: global.INVALID_USER_ID});
});

router.get('/search_users_by_id/:user_id', function(req, res) {
  data.getUserById(req.param('user_id'), function(result) {
    return res.json(result);
  });
});

router.get('/search_users_by_name/', function(req, res) {
  return res.json({errCode: 1, users: []});
});

router.get('/search_users_by_name/:user_name', function(req, res) {
  data.getUserByName(req.param('user_name'), function(result) {
    return res.json(result);
  });
});

router.get('/get_profile/:user_id', function(req, res) {
  return res.json({errCode: global.SUCCESS, profile : "profile"});
});

router.get('/get_friends/:user_id', function(req, res) {
  return res.json({errCode: global.SUCCESS,
    friends : [
      {username : "kevin", user_id : "123"},
      {username : "yaohui", user_id : "1234"}
    ]});
});

module.exports = router;
