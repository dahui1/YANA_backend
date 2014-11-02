var express = require('express');
var data = require('../model/user_model');
var passport = require('passport');
var router = express.Router();

/* GET users listing. */

router.get('/user_list', function(req, res) {
  data.allUsers(function(result) {
    return res.json(result);
  });
});

router.post('/create_user', function(req, res) {
  var isValidUsername = data.checkUsername(req.body.username);
  var isValidPassword = data.checkPassword(req.body.password);
  if (isValidUsername) return res.json({ 'errCode': isValidUsername });
  if (isValidPassword) return res.json({ 'errCode': isValidPassword });

  //data.add(req.body.username, req.body.password, function(result) {
  //  return res.json(result);
  passport.authenticate('local-signup', function(err, result, info) {
    if (err) return res.send(err);
    return res.json(info);
  })(req);
});

router.post('/login', function(req, res) {
  passport.authenticate('local-login', function(err, result, info) {
    if (err) return res.send(err);
    if (result) {
      // Save user info into session
      req.logIn(result, function(err) {
        if (err) 
          return res.json(err);
        return res.json(info);
      });
    }
  })(req);
});

router.post('/logout', data.isLoggedIn, function(req, res) {
  req.logout();
  return res.json({errCode: global.SUCCESS});
});

router.get('/search_users_by_id/', data.isLoggedIn, function(req, res) {
  return res.json({ errCode: global.INVALID_USER_ID });
});

router.get('/search_users_by_id/:user_id', data.isLoggedIn, function(req, res) {
  data.getUserById(req.param('user_id'), function(result) {
    return res.json(result);
  });
});

router.get('/search_users_by_name/', data.isLoggedIn, function(req, res) {
  return res.json({ errCode: 1, users: [] });
});

router.get('/search_users_by_name/:username', data.isLoggedIn, function(req, res) {
  data.getUserByName(req.param('username'), function(result) {
    return res.json(result);
  });
});

router.get('/profile/:user_id', data.isLoggedIn, function(req, res) {
  data.getUserById(req.param('user_id'), function(result) {
    return res.json({ errCode: global.SUCCESS, profile: result.username });
  });
});

module.exports = router;
