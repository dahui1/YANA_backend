var express = require('express');
var assert = require('assert');
var should = require('should');
var passport = require('passport');

var app = require('../app');
var model = require('../model/user_model');
var friends = require('../model/friends_model');

require('../test_variables');

// Generate a random name for each test
var randomName = Math.floor((Math.random() * 10000) + 1);

/*
User: {name: global.test_user1, password: 'test', _id: global.test_user1_id} and
User: {name: global.test_user2, password: 'test', _id: global.test_user2_id} are created for testing only
*/

describe('Check User name', function(){
  it('should return 0 when the name is valid', function(){
  	var result = model.checkUsername("test");
  	assert.equal(0, result);
  });

  it('should return -1 when the name is too long', function(){
  	var name = "1234567890123456789012345678901234567890" +
  			   "1234567890123456789012345678901234567890" +
  			   "1234567890123456789012345678901234567890" +
  			   "1234567890123456789012345678901234567890";
  	var result = model.checkUsername(name);
    assert.equal(-1, result);
  });

  it('should return -1 when the name is empty', function(){
  	var name = '';
  	var result = model.checkUsername(name);
  	assert.equal(-1, result);
  });
});

describe('Check Password', function(){
  it('should return 0 when the password is valid', function(){
  	var result = model.checkPassword("test");
  	assert.equal(0, result);
  });

  it('should return -2 when the password is too long', function(){
  	var password = "1234567890123456789012345678901234567890" +
  			  "1234567890123456789012345678901234567890" +
  			  "1234567890123456789012345678901234567890" +
  			  "1234567890123456789012345678901234567890";
  	var result = model.checkPassword(password);
    assert.equal(-2, result);
  });

  it('should return 0 when the password is empty', function(){
  	var password = '';
  	var result = model.checkPassword(password);
  	assert.equal(-2, result);
  });
});


describe('Create User function', function(){
  it('should return {errCode: 1} when the name and password are both valid and the user doesn\'t exist', function(done){
    var req = {};
    req.body = {};
    req.body.username = randomName;
    req.body.password = 'test124';
    passport.authenticate('local-signup', function(err, result, info) {
      if (err) 
        throw err;
      if (result) {
        assert.equal(randomName, result.username);
        assert.equal(1, info.errCode);
      }
      done();
    })(req);
  });

  it('should return {errCode: -3} when the user already exists', function(done){
    var req = {};
    req.body = {};
    req.body.username = randomName;
    req.body.password = 'test124';
    passport.authenticate('local-signup', function(err, result, info) {
      if (err) 
        throw err;
      if (result) {
        assert.equal(-3, info.errCode);
      }
      done();
    })(req);
  });
});

describe('Login function', function(){
  it('should return {errCode: 1, user_id: x} when the name and password are both valid', function(done){
    var req = {};
    req.body = {};
    req.body.username = randomName;
    req.body.password = 'test124';
    passport.authenticate('local-login', function(err, result, info) {
      if (err) 
        throw err;
      if (result) {
        assert.equal(randomName, result.username);
        assert.equal(1, info.errCode);
      }
      done();
    })(req);
  });

  it('should return {errCode: -4} when the password is incorrect', function(done){
    var req = {};
    req.body = {};
    req.body.username = 'test124';
    req.body.password = 'test124';
    passport.authenticate('local-login', function(err, result, info) {
      if (err) 
        throw err;
      if (result) {
        assert.equal(randomName, result.username);
        assert.equal(-4, info.errCode);
      }
      done();
    })(req);    
  });

  it('should return {errCode: -4} when the user doesn\'t exist', function(done){
    var req = {};
    req.body = {};
    req.body.username = 'test123';
    req.body.password = 'test124';
    passport.authenticate('local-login', function(err, result, info) {
      if (err) 
        throw err;
      if (result) {
        assert.equal(randomName, result.username);
        assert.equal(-4, info.errCode);
      }
      done();
    })(req);
  });

  it('should return the user object when login with Facebook account', function(done) {
    model.addUserWithFB('745727562188279', 'Yaohui Ye', 'yeyh10@gmail.com', function(result) {
      assert.equal('yeyh10@gmail.com', result.username);
      done();
    });
  });
});

describe('Search user function', function(){
  it('should return {errCode: 1, users: []} when the name is valid', function(done){
    model.getUserByName('testonly', function(result) {
      assert.equal(1, result.errCode);
      assert.equal(4, result.users.length);
      done();
    });
  });

  it('should return {errCode: 1, username: testonly, profile: {}} when the id exists', function(done){
    model.getUserById(global.test_user1_id, function(result) {
      assert.equal(1, result.errCode);
      assert.equal(global.test_user1, result.username);
      done();
    });
  });

  it('should return {errCode: -5} when the id doesn\'t exist', function(done){
    model.getUserById('notexist', function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });
});

describe('Edit user profile', function(){
  it('should return {errCode: 1} when the user_id is valid', function(done){
    var reqbody = {
      user_id : global.test_user1_id,
      age : 39,
      gender : 'Male',
      about : 'YANA is great',
      privacy : 0
    };
    model.edit_profile(reqbody, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it('should return {errCode: -5} when the user_id doesn\'t exist', function(done){
    var reqbody = {
      user_id : "notexist",
      age : 39,
    };

    model.edit_profile(reqbody, function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });
});

describe('Get user profile', function(){
  it('should return errCode=1 and the user\'s profile when user_id equals to target_id', function(done){
    model.getUserProfile(global.test_user1_id, global.test_user1_id, function(result) {
      assert.equal(result.errCode, 1);
      assert.equal(result.profile.username, global.test_user1);
      assert.equal(result.profile.age, 39);
      assert.equal(result.profile.gender, 'Male');
      done();
    });
  });

  it('should return errCode=1 and the user\'s name and about when target_id\'s privacy setting is private', function(done){
    model.getUserProfile(global.test_user1_id, global.test_user2_id, function(result) {
      assert.equal(result.errCode, 1);
      assert.equal(Object.keys(result.profile).length, 2);
      done();
    });
  });

  it('should return errCode=1 and the user\'s whole profile when target_id\'s privacy setting is public', function(done){
    model.getUserProfile(global.test_user1_id, global.test_user3_id, function(result) {
      assert.equal(result.errCode, 1);
      result.profile.should.have.property("username");
      result.profile.should.have.property("about");
      result.profile.should.have.property("age");
      done();
    });
  });

  it('should return errCode=1 and the user\'s whole profile when target_id\'s privacy setting is friend while they are friends', function(done){
    friends.follow(global.test_user1_id, global.test_user4_id, function(r) {
      model.getUserProfile(global.test_user1_id, global.test_user4_id, function(result) {
        assert.equal(result.errCode, 1);
        result.profile.should.have.property("username");
        result.profile.should.have.property("about");
        result.profile.should.have.property("age");
        friends.unfollow(global.test_user1_id, global.test_user4_id, function() {
          done();
        });
      });
    });
  });

  it('should return errCode=1 and the user\'s name and about when target_id\'s privacy setting is friend while they are not friends', function(done){
    model.getUserProfile(global.test_user1_id, global.test_user4_id, function(result) {
      assert.equal(result.errCode, 1);
      result.errCode.should.equal(1);
      result.profile.should.have.property("username");
      result.profile.should.have.property("about");
      Object.keys(result.profile).length.should.equal(2);
      done();
    });
  });
});

describe('Update user location function', function() {
  it ('should return {errCode: 1} on successful update location', function(done) {
    model.updateUserLocation(global.test_user_id, 100, -100, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });
});

describe('Get Nearby Users with Filter function', function() {
  it ('should return {errCode: 1} with only required params', function(done) {
    model.getNearbyUsersWithFilter(global.test_user_id, true, 100, -100, undefined, undefined, undefined, undefined,  function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it ('should return {errCode: 1} with range', function(done) {
    model.getNearbyUsersWithFilter(global.test_user_id, true, 100, -100, 5, undefined, undefined, undefined, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it ('should return {errCode: 1} with gender', function(done) {
    model.getNearbyUsersWithFilter(global.test_user_id, true, 100, -100, undefined, "male", undefined, undefined, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it ('should return {errCode: 1} with age range', function(done) {
    model.getNearbyUsersWithFilter(global.test_user_id, true, 100, -100, undefined, undefined, 0, 100, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it ('should return {errCode: 1} with range, gender, age range', function(done) {
    model.getNearbyUsersWithFilter(global.test_user_id, true, 100, -100, 5, "male", 0, 100, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });
});
