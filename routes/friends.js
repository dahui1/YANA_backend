var express = require('express');
var data = require('../model/friends_model');
var router = express.Router();

/* GET users listing. */

router.get('/all_friends', function(req, res) {
  data.allFriends(function(result) {
    return res.json(result);
  });
});

router.post('/add_friend', function(req, res) {
  data.follow(req.body.to_id, req.body.from_id, function(result) {
    return res.json(result);
  });
});

router.post('/delete_friend', function(req, res) {
  data.unfollow(req.body.to_id, req.body.from_id, function(result) {
    return res.json(result);
  });
});

module.exports = router;
