var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../model/db_collections').User;

var configAuth = require('./auth');

require('../err_codes');

module.exports = function(passport) {

	// Set up passport session
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Local setup
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({'username' : username}, function(err, user) {
				if (err)
					return done(err);

				if (user) {
					return done(null, false, { errCode: global.USERNAME_ALREADY_EXISTS });
				} else {
					var newUser = new User();
					newUser.username = username;
					newUser.password = newUser.generateHash(password);

					newUser.save(function(err, u) {
						if (err)  return done(err);
						return done(null, u, { errCode: global.SUCCESS, user_id: u._id });
					})
				}
			});
		});
	}));

	// Local setup
	passport.use('local-login', new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password',
		passReqToCallback : true
	}, function(req, username, password, done) {
		process.nextTick(function() {
			User.findOne({'username' : username}, function(err, user) {
				if (err)
					return done(err);

				if (user.facebook.id != null)
					return done(null, false, { errCode: global.WRONG_USERNAME_OR_PASSWORD });
				if (!user) {
					return done(null, false, { errCode: global.WRONG_USERNAME_OR_PASSWORD });
				} else if (!user.validPassword(password)) {
					return done(null, false, { errCode: global.WRONG_USERNAME_OR_PASSWORD });
				} else {
					return done(null, user, { errCode: global.SUCCESS, user_id: user._id });
				}
			});
		});
	}));
};