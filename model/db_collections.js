var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  username : String,
  password : String,
  device_token : String,
  profile : {
    privacy : Number,
    about : String,
    age : Number,
    gender : String,
    phone_number : String
  },
  friends : [String],
  longitude : Number,
  latitude : Number},
  {collection : 'users'}
);

User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

var Request = new Schema({
  owner_id : String,
  owner_username : String,
  invitations: [String],
  accepted_user: String,
  declined_users: [String],
  meal_type: String,
  meal_time: String,
  restaurant: String,
  comment: String,
  url : String},
  {collection : 'requests'}
);

var Friends = new Schema({
  to_username : String,
  to_id : String,
  from_username : String,
  from_id : String},
  {collection : 'friends'}
);

var Notifications = new Schema({
  to_id : String,
  content : String,
  time : String},
  {collection : 'notifications'}
);

var collections = {
  User : mongoose.model('User', User),
  Request : mongoose.model('Request', Request),
  Friends : mongoose.model('Friends', Friends)
};

module.exports = collections;