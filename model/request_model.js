var collections = require('./db_collections');
var apn = require('apn');
var options = { };
var apnConnection = new apn.Connection(options);
var Request = collections.Request;
var User = collections.User;

exports.createRequest =
    function(user_id,
             username,
             invitations,
             meal_type,
             meal_time,
             restaurant,
             comment,
             callback) {
  if (arguments.length != 8) return callback({ errCode: global.INVALID_PARAMS });
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
      sendPush(invited_user, "send", meal_type, meal_time);
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
    request.update({ _id: req_id }, { $set : { accepted_user: user_id }}, function(err, req) {
      if (err) return callback({ errCode: global.ERROR });
      if (!req) return callback({ errCode: global.ERROR });
      request.findOne({ _id: req_id}, function(err, request) {
        if (err) return callback({ errCode: global.ERROR });
        if (!request) return callback({ errCode: global.SUCCESS });
        sendPush(request.owner_id, "accept", request.meal_type, request.meal_time);
        return callback({ errCode: global.SUCCESS, request_id: request._id });
      });
    });
  } else if (action == "decline") {
    request.update({ _id : req_id }, { $push : { declined_users: user_id }}, function(err, req) {
      if (err) return callback({ errCode: global.ERROR });
      if (!req) return callback({ errCode: global.ERROR });
      // return callback({ errCode: global.SUCCESS, waaa: "waaa", request_id: req._id });
      request.findOne({ _id: req_id}, function(err, request) {
        if (err) return callback({ errCode: global.ERROR });
        if (!request) return callback({ errCode: global.SUCCESS });
        return callback({ errCode: global.SUCCESS, request_id: request._id });
      });
    });
  }
};

function sendPush(user_id, type, meal_type, meal_time) {
  var user = User;
  user.findById(user_id, function (err, res) {
    if (res != null && res.device_token != null) {
      var device = new apn.Device(res.device_token);
      var new_request_push = new apn.Notification();
      if (type == "send") {
        new_request_push.alert = res.username + " has invited you to get " + meal_type + " at " + meal_time + "!";
      } else if (type == "accept") {
        new_request_push.alert =
          res.username + " has accepted your invitation to get " + meal_type + " at " + meal_time + "!";
      }

      new_request_push.payload = { 'thisisfrom': 'kevin' };
      apnConnection.push(new_request_push, device);
    }
  });
};

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
