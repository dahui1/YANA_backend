var express = require('express');
var data = require('../model/user_model');
var router = express.Router();

/* GET users listing. */

router.get('/user_list', function(req, res) {
  data.allUsers(function(result) {
    return res.json(result);
  });
});

router.post('/create_user', function(req, res) {
  var isValidUsername = data.checkUser(req.body.username);
  var isValidPassword = data.checkPwd(req.body.password);
  if (isValidUsername) return res.json({ 'errCode': isValidUsername });
  if (isValidPassword) return res.json({ 'errCode': isValidPassword });

  data.add(req.body.username, req.body.password, function(result) {
    return res.json(result);
  });
});

router.post('/login', function(req, res) {
  data.login(req.body.username, req.body.password, function(result) {
    return res.json(result);
  });
});

router.get('/search_users_by_id/', function(req, res) {
  return res.json({ errCode: global.INVALID_USER_ID });
});

router.get('/search_users_by_id/:user_id', function(req, res) {
  data.getUserById(req.param('user_id'), function(result) {
    return res.json(result);
  });
});

router.get('/search_users_by_name/', function(req, res) {
  return res.json({ errCode: 1, users: [] });
});

router.get('/search_users_by_name/:username', function(req, res) {
  data.getUserByName(req.param('username'), function(result) {
    return res.json(result);
  });
});

router.get('/profile/:user_id', function(req, res) {
  return res.json({ errCode: global.SUCCESS, profile : "profile" });
});

router.get('/friend_list/:user_id', function(req, res) {
  return res.json({ errCode: global.SUCCESS,
    friends: [
      {username : "kevin", user_id : "123"},
      {username : "yaohui", user_id : "1234"}]
    });
});

module.exports = router;
