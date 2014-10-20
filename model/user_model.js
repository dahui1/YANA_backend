var collections = require('./db_collections');
var User = collections.User;

exports.checkUser = function(user) {
  if (user.length > global.MAX_USERNAME_LENGTH || user.length == 0)
    return global.INVALID_USERNAME;
  return 0;
}

exports.checkPwd = function(pwd) {
  if (pwd.length > global.MAX_PASSWORD_LENGTH)
    return global.INVALID_PASSWORD;
  return 0;
};

// User Login
exports.login = function(user, pwd, callback) {
  var usr = User;
  usr.findOne({name: user}, function(err, result){
    if (err) return callback({errCode: global.ERROR});

    // User not existing or the password is wrong
    if (result == null || result.password != pwd)
     return callback({errCode: global.WRONG_USERNAME_OR_PASSWORD});

    // save the result
    result.save(function(err) {
      if (err) return callback({errCode: global.ERROR});
      return callback({errCode: global.SUCCESS, user_id: result._id});
  	});
  });
};

// Create Account
exports.add = function(user, pwd, callback) {
  var usr = User;

  // Check if the user name exists
  usr.findOne({name: user},function(err, result){
    if (err) return callback({errCode: global.ERROR});
    if (result != null) 
      return callback({errCode: global.USERNAME_ALREADY_EXISTS});

    // Add the user to the database
    var newuser = new usr();
    newuser.name = user;
    newuser.password = pwd;
    newuser.profile = "test";

    newuser.save(function(err, u) {
      if (err) return callback({errCode: global.ERROR});
      return callback({errCode: global.SUCCESS, user_id: u._id});
    });
  });
};

exports.getUserById = function(user_id, callback) {
  User.findById(user_id, function(err, res){
    if (err) callback({errCode: global.ERROR});
    if (res == null) {
      return callback({errCode: global.INVALID_USER_ID});
    }
    return callback({errCode: global.SUCCESS, user_name: res.name, user_profile: res.profile});
  });
}

exports.getUserByName = function(user_name, callback) {
  var query = {};
  query['name'] = new RegExp(user_name);
  User.find(query, function(err, users) {
    if (err) return callback({errCode: global.ERROR});

    result = {};
    result['errCode'] = global.SUCCESS;
    result['users'] = [];
    var count = 0;
    users.forEach (function(u) {
      var oneUser = {user_id: u._id, user_name: u.name, user_profile: u.profile};
      result['users'][count++] = oneUser;
    });
    return callback(result);
  });
}

// Delete all users (for testing)
exports.deleteall = function(callback) {
  var user = User;
  user.find(function(err, users) {
    if (err) return callback({errCode: global.ERROR});
  	for (var i = 0; i < users.length; i++) {
      user.remove({
      	_id: users[i]._id
      }, function(err) {
      	if (err) return callback({errCode: global.ERROR});
  	  });
  	};
  	return callback({errCode: global.SUCCESS});
  });
};

// List all users (for testing)
exports.allusers = function(callback) {
  var user = User;
  user.find(function(err, users) {
    if (err) return callback({errCode: global.ERROR});
    return callback(users);
  })
};