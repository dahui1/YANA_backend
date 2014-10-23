var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    name : String,
    password : String,
    profile : String,
    friends : [String]
    },
    {collection : 'users'}
);

var Request = new Schema({
	owner_id : String,
	owner_username : String,
	invitations: [String],
	accepted_user: String,
	meal_type: String,
	meal_time: Date,
	restaurant: String,
	comment: String},
	{collection : 'requests'}
);

var Friends = new Schema({
	to_username : String,
	to_id : String,
	from_id : String},
	{collection : 'friends'}
);

var collections = {
	User : mongoose.model('User', User),
	Request : mongoose.model('Request', Request),
	Friends : mongoose.model('Friends', Friends)
};

module.exports = collections;