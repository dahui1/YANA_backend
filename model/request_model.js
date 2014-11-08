var collections = require('./db_collections');
var Request = collections.Request;
var User = collections.User;
var Friend = collections.Friends;

var apn = require('apn');
var path = require('path');

var notificationCallback = function(errorNum, notification){
  console.log('Error is: %d', errorNum);
  console.log('notification: '+ notification);
};

var options = {
  cert: path.join(__dirname + './../cert.pem'), /* Certificate file path */
  key:  path.join(__dirname + './../key.pem'),  /* Key file path */
  gateway: 'gateway.sandbox.push.apple.com',
  errorCallback: notificationCallback         /* Callback when error occurs function(err,notification) */
};

var apnConnection = new apn.Connection(options);

exports.createRequest =
    function(user_id,
             username,
             invitations,
             meal_type,
             meal_time,
             restaurant,
             comment,
             callback) {
  var request = Request;
  var new_request = new request();
  new_request.owner_id = user_id;
  new_request.owner_username = username;
  new_request.invitations = invitations;
  new_request.meal_type = meal_type;
  new_request.meal_time = meal_time;
  new_request.restaurant = restaurant;
  new_request.comment = comment;

  new_request.accepted_user = "";
  new_request.declined_users = [];

  if (invitations instanceof Array) {
    invitations.forEach(function (invited_user) {
      sendPush(user_id, invited_user, "send", meal_type, meal_time);
    });
  }

  new_request.save(function(err, req) {
    if (err) return callback({ errCode: global.ERROR });
    return callback({ errCode: global.SUCCESS, request_id: req._id });
  });
};

exports.getRequests = function(user_id, callback) {
  var request = Request;
  request.find({ $or: [{ owner_id: user_id }, { invitations: user_id }] }, function(err, requests) {
    if (err) return callback({ errCode: global.ERROR });
    return callback({ errCode: global.SUCCESS, requests: requests });
  });
};

exports.handleRequest = function(user_id, req_id, action, callback) {
  var request = Request;

  // if req_id does not exist, nothing will happen. i think request._id will be null
  if (action == "accept") {
    var query = request.where({ _id: req_id });
    query.findOne(function(err, request) {
      if (err) return callback({ errCode: global.ERROR });
      if (!request) return callback({ errCode: global.SUCCESS });
      sendPush(user_id, request.owner_id, "accept", request.meal_type, request.meal_time);
      request.accepted_user.$set(user_id);
      request.save();
      return callback({ errCode: global.SUCCESS, request_id: request._id });
    });
  } else if (action == "decline") {
    var query = request.where({ _id: req_id });
    query.findOne(function(err, request) {
      if (err) return callback({ errCode: global.ERROR });
      if (!request) return callback({ errCode: global.SUCCESS });
      request.declined_users.$push(user_id);
      request.save();
      return callback({ errCode: global.SUCCESS, request_id: request._id });
    });
  }
};

function sendPush(sender_id, user_id, type, meal_type, meal_time) {
  var user = User;
  user.findById(user_id, function (err, res) {
    if (res != null && res.device_token != null) {
      Friend.find({ from_id: sender_id, to_id: user_id, blocked: false }, function(err, pair) {
        if (!err) {
          var device = new apn.Device(res.device_token);
          var new_request_push = new apn.Notification();
          if (type == "send") {
            new_request_push.alert = res.username + " has invited you to get " + meal_type + " at " + meal_time + "!";
          } else if (type == "accept") {
            new_request_push.alert =
              res.username + " has accepted your invitation to get " + meal_type + " at " + meal_time + "!";
          }
          apnConnection.pushNotification(new_request_push, device);
        }
      });
    }
  });
};

// Delete single request (for testing)
exports.deleteRequest = function(request_id, callback) {
  Request.remove({ _id: request_id }, function(err, res) {
    if (err) return callback({ errCode: global.INVALID_REQUEST_ID });
    return callback({ errCode: global.SUCCESS });
  });
}

// Delete all requests (for testing)
exports.deleteAll = function(callback) {
  var request = Request;
  request.find(function(err, rs) {
    if (err) return callback(err);
    for (var i = 0; i < rs.length; i++) {
      request.remove({
        _id: rs[i]._id
      }, function(err) {
        if (err) return callback(err);
      });
    };
    return callback(false);
  });
};
