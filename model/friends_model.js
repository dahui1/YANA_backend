var collections = require('./db_collections');
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

// List all friend pairs (for testing)
exports.allFriends = function(callback) {
  var friends = Friends;
  friends.find(function(err, fs) {
    if (err) return callback(err);
    return callback(fs);
  })
};