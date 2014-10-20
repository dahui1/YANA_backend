var collections = require('./db_collections');
var Request = collections.Request;

exports.create_request = function(user_id,
                                  invitations,
                                  meal_type,
                                  meal_time,
                                  restaurant,
                                  comment,
                                  callback) {
    var request = Request;

    var new_request = new request();
    new_request.owner_id = user_id;
    new_request.invitations = invitations;
    new_request.meal_type = meal_type;
    new_request.restaurant = restaurant;
    new_request.comment = comment;

    new_request.accepted_user = "";

    new_request.save(function(err, req) {
        if (err) return callback({ errCode : global.ERROR });
        return callback({ errCode : global.SUCCESS, request_id : req._id });
    });
};

exports.request_lists = function(user_id, callback) {
    var request = Request;
    request.find(function(err, requests) {
        if (err) return callback({ errCode : global.ERROR });
        return callback(requests);
    });
};

exports.handle_request = function(user_id, req_id, action, callback) {
    var request = Request;

    // if req_id does not exist, nothing will happen. i think req._id will be null
    request.update({ _id : req_id }, { $set : { accepted_user : user_id }}, function(err, req) {
        if (err) return callback({ errCode : global.ERROR });
        return callback({ errCode : global.SUCCESS, request_id : req._id });
    });
};