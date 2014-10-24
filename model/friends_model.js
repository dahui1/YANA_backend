var collections = require('./db_collections');
var jquery = require('jquery');
var Friends = collections.Friends;
var User = collections.User;

// user with from_id follows user with to_id
exports.follow = function(to_id, from_id, callback) {
  var user = User;
  user.findById(to_id, function(err, to_res){
    // User doesn't exist
    if (err) return callback({errCode: global.INVALID_USER_ID});

    user.findById(from_id, function(err, from_res) {
      // User doesn't exist
      if (err) return callback({ errCode: global.INVALID_USER_ID });

      Friends.findOne({ to_id: to_id, from_id: from_id }, function(err, pair) {
        if (err) return callback({ errCode: global.ERROR });
        if (pair) return callback({ errCode: global.ALREADY_FOLLOWED });
        var newFriends = new Friends();
        newFriends.to_username = to_res.name;
        newFriends.to_id = to_id;
        newFriends.from_id = from_id;

        newFriends.save(function(err) {
          if (err) return callback({ errCode: global.ERROR });
          return callback({ errCode: global.SUCCESS });
        });
      });
    });
  });
};

// user with from_id unfollows user with to_id
exports.unfollow = function(to_id, from_id, callback) {
  var user = User;
  Friends.findOne({ to_id: to_id, from_id: from_id }, function(err, pair) {
    if (err) return callback({ errCode: global.ERROR });

    if (pair) {
      Friends.remove({_id: pair._id}, function(err) {
        if (err) return callback({ errCode: global.ERROR });
        return callback({ errCode: global.SUCCESS });
      });
    } else {
      user.findById(to_id, function(err, to_res) {
        // User doesn't exist
        if (err) return callback({ errCode: global.INVALID_USER_ID });
        user.findById(from_id, function(err, from_res) {
          // User doesn't exist
          if (err) return callback({ errCode: global.INVALID_USER_ID });
          return callback({ errCode: global.NOT_FOLLOWING });
        });
      });
    }
  });
};

exports.getFriends = function(user_id, callback) {
  Friends.find({ from_id: user_id }, function(err, res) {
    if (err) callback({ errCode: global.ERROR });
    if (res == null) return callback({ errCode: global.INVALID_USER_ID });
    return callback({ errCode: global.SUCCESS, friends: res });
  });
};

exports.getFriendRequests = function(user_id, callback) {
  Friends.find({ to_id: user_id }, function(err, response) {
    if (err) callback({ errCode: global.ERROR });
    if (response == null) return callback({ errCode: global.INVALID_USER_ID });

    result = {};
    result['errCode'] = 1;
    result['friends'] = [];

    var len = response.length;
    var count = 0;

    response.forEach(function(r) {
      Friends.find({ from_id: user_id, to_id: r.from_id }, function(err, res) {
        if (err) callback({ errCode: global.ERROR });
        if (res == '') {
          var f = { to_username: r.to_username, to_id: r.to_id, from_id: r.from_id };
          result['friends'].push(f);
        }
        count++;
        if (count == len)
          return callback(result);
      });
    });
  });
};

// List all friend pairs (for testing)
exports.allFriends = function(callback) {
  var friends = Friends;
  friends.find(function(err, fs) {
    if (err) return callback(err);
    return callback(fs);
  })
};