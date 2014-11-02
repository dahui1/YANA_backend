var collections = require('./db_collections');
var Request = collections.Request;

exports.createRequest =
    function(user_id,
             invitations,
             meal_type,
             meal_time,
             restaurant,
             comment,
             callback) {
  if (arguments.length != 7) return { errCode: global.INVALID_PARAMS };
  var request = Request;
  var new_request = new request();
  new_request.owner_id = user_id;
  new_request.invitations = invitations;
  new_request.meal_type = meal_type;
  new_request.meal_time = meal_time;
  new_request.restaurant = restaurant;
  new_request.comment = comment;

  new_request.accepted_user = "";
  new_request.declined_users = [];

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
