require('../test_variables');
var collections = require('./db_collections');
var User = collections.User;
var Friends = collections.Friends;

exports.checkUsername = function(user) {
  if (user.length > global.MAX_USERNAME_LENGTH || user.length == 0)
    return global.INVALID_USERNAME;
  return 0;
}

exports.checkPassword = function(password) {
  if (password.length > global.MAX_PASSWORD_LENGTH || password.length == 0)
    return global.INVALID_PASSWORD;
  return 0;
};

// User Login (has been moved to passport.js)
exports.login = function(username, password, callback) {
  var user = User;
  user.find({ username: username }, function(err, res){
    if (err) return callback({ errCode: global.ERROR });

    // User not existing or the password is wrong
    if (res == null || res.password != password)
      return callback({ errCode: global.WRONG_USERNAME_OR_PASSWORD });

    // save the res
    res.save(function(err) {
      if (err) return callback({ errCode: global.ERROR });
      return callback({ errCode: global.SUCCESS, user_id: res._id });
    });
  });
};

exports.updateDeviceToken = function(user_id, device_token, callback) {
  var user = User;
  user.update({ _id: user_id }, { $set: { device_token: device_token } },
    function(err, res) {
      if (err) return callback({ errCode: global.ERROR });
      if (res == null) return callback({ errCode: global.INVALID_USER_ID });
      return callback({ errCode: global.SUCCESS });
    }
  );
};

// Create Account (has been moved to passport.js)
exports.add = function(username, password, callback) {
  var user = User;

  // Check if the user name exists
  user.findOne({ username: username },function(err, res){
    if (err) return callback({ errCode: global.ERROR });
    if (res != null) return callback({ errCode: global.USERNAME_ALREADY_EXISTS });

    // Add the user to the database
    var newuser = new user();
    newuser.username = username;
    newuser.password = password;
    newuser.profile = "test";

    newuser.save(function(err, u) {
      if (err) return callback({ errCode: global.ERROR });
      return callback({ errCode: global.SUCCESS, user_id: u._id });
    });
  });
};

exports.deleteUser = function(user_id, callback) {
  User.remove({ _id: user_id }, function(err, res) {
    if (err) return callback({ errCode: global.INVALID_USER_ID });
    return callback({ errCode: global.SUCCESS });
  });
}

exports.getUserById = function(user_id, callback) {
  User.findById(user_id, function(err, res){
    // if (err) callback({errCode: global.ERROR});
    if (res == null) return callback({ errCode: global.INVALID_USER_ID });
    return callback({ errCode: global.SUCCESS, username: res.username, profile: res.profile });
  });
}

exports.getUserByName = function(username, callback) {
  var query = {};
  // Any username that contains the string
  query['username'] = new RegExp(username);
  User.find(query, function(err, users) {
    if (err) return callback({ errCode: global.ERROR });

    result = {};
    result['errCode'] = global.SUCCESS;
    result['users'] = [];
    var count = 0;
    users.forEach(function(u) {
      var oneUser = { user_id: u._id, username: u.username, profile: u.profile };
      result['users'][count++] = oneUser;
    });

    return callback(result);
  });
}

exports.getUserProfile = function(user_id, target_id, callback) {
  User.findById(target_id, function(err, res){
    if (res == null) return callback({ errCode: global.INVALID_USER_ID });

    var result = {};

    // If user gets his own profile, just return everything in profile
    if (user_id == target_id) {
        result['errCode'] = 1;
        result['profile'] = { username: res.username, about: res.profile.about, age: res.profile.age, food_preferences: res.profile.food_preferences, gender: res.profile.gender, phone_number: res.profile.phone_number };
        return callback(result);
    }

    Friends.findOne({ 'to_id': user_id, 'from_id': target_id }, function (err, followed) {
      if (err) return callback({ errCode: global.ERROR });
      Friends.findOne({ 'to_id': target_id, 'from_id': user_id }, function (err, follow) {
        if (err) return callback({ errCode: global.ERROR });

        result['errCode'] = global.SUCCESS;
        if (followed) result['followed'] = 1;
        else result['followed'] = 0;

        if (follow) result['follow'] = 1;
        else result['follow'] = 0;

        if (res.profile.privacy == 0 || (res.profile.privacy == 1 && !followed)) {
          // Privacy setting is PRIVATE or privacy setting is FRIENDS but not followed, just return username and about
          result['profile'] = { username: res.username, about: res.profile.about };
          return callback(result);
        } else {
          // No privacy settings or privacy setting is PUBLIC or 
          // privacy setting is FRIENDS and followed, return everything
          result['profile'] = { username: res.username, about: res.profile.about, age: res.profile.age, food_preferences: res.profile.food_preferences, gender: res.profile.gender, phone_number: res.profile.phone_number };
          return callback(result);
        }
      });
    });
  });
}

exports.edit_profile = function(reqbody, callback) {
  User.findById(reqbody.user_id, function(err, res) {
    if (err) return callback({ errCode: global.ERROR });

    if (res == null) return callback({ errCode: global.INVALID_USER_ID });

    if (reqbody.privacy != null)
      res.profile.privacy = reqbody.privacy;
    if (reqbody.phone_number != null)
      res.profile.phone_number = reqbody.phone_number;
    if (reqbody.age != null)
      res.profile.age = reqbody.age;
    if (reqbody.gender != null)
      res.profile.gender = reqbody.gender;
    if (reqbody.food_preferences != null)
      res.profile.food_preferences = reqbody.food_preferences;
    if (reqbody.about != null)
      res.profile.about = reqbody.about;

    res.save(function(err, u) {
      if (err) return callback({ errCode: global.ERROR });
      return callback({ errCode: global.SUCCESS });
    })
  });
}

// Delete all users (for testing)
exports.deleteAll = function(callback) {
  var user = User;
  user.find(function(err, users) {
    if (err) return callback(err);
  	for (var i = 0; i < users.length; i++) {
      if (users[i]._id == global.test_user1_id ||
          users[i]._id == global.test_user2_id)
        continue;
      user.remove({
      	_id: users[i]._id
      }, function(err) {
      	if (err) return callback(err);
  	  });
  	};
  	return callback(false);
  });
};

exports.deleteUserById = function(user_id, callback) {
  User.findById(user_id, function(err, res){
    if (err) callback({errCode: global.ERROR});
    if (res == null) return callback({ errCode: global.INVALID_USER_ID });
    User.remove({
      _id: res._id
    }, function(err) {
      if (err) return callback(err);
      return callback({ errCode: global.SUCCESS });
    });
  });
};

// List all users (for testing)
exports.allUsers = function(callback) {
  User.find(function(err, users) {
    if (err) return callback({errCode: global.ERROR});
    return callback(users);
  })
};

exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.json({ errCode: INVALID_ACTION });
}