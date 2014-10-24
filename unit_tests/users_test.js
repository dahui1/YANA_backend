var express = require('express');
var assert = require('assert');

var app = require('../app');
var model = require('../model/user_model');

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
  	assert.equal(0, result);
  });
});


describe('Create User function', function(){
  it('should return {errCode: 1} when the name and password are both valid and the user doesn\'t exist', function(done){
    model.add(randomName, 'test124', function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it('should return {errCode: -3} when the user already exists', function(done){
  	model.add(randomName, 'test125', function(result) {
  	  assert.equal(-3, result.errCode);
  	  done();
  	});
  });
});

describe('Login function', function(){
  it('should return {errCode: 1, user_id: x} when the name and password are both valid', function(done){
  	model.login(global.test_user1, 'test', function(result) {
  	  assert.equal(1, result.errCode);
      assert.equal(global.test_user1_id, result.user_id);
  	  done();
  	});
  });

  it('should return {errCode: -4} when the password is invalid', function(done){
  	model.login('test124', 'test124', function(result) {
  	  assert.equal(-4, result.errCode);
  	  done();
  	});
  });

  it('should return {errCode: -4} when the user doesn\'t exist', function(done){
  	model.login('test123', 'test124', function(result) {
  	  assert.equal(-4, result.errCode);
  	  done();
  	});
  });
});

describe('Search user function', function(){
  it('should return {errCode: 1, users: []} when the name is valid', function(done){
    model.getUserByName('unittest', function(result) {
      assert.equal(1, result.errCode);
      assert.equal(2, result.users.length);
      assert.equal(global.test_user1_id, result.users[0].user_id);
      assert.equal(global.test_user1, result.users[0].username);
      assert.equal(global.test_user2_id, result.users[1].user_id);
      assert.equal(global.test_user2, result.users[1].username);
      done();
    });
  });

  it('should return {errCode: 1, username: unittestonly, profile: test} when the id exists', function(done){
    model.getUserById(global.test_user1_id, function(result) {
      assert.equal(1, result.errCode);
      assert.equal(global.test_user1, result.username);
      assert.equal('test', result.profile);
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