var express = require('express');
var assert = require('assert');
var should = require('should');

var app = require('../app');
var model = require('../model/user_model');

// Generate a random name for each test
var randomname = Math.floor((Math.random() * 10000) + 1);

/*
User: {name: 'unittestonly', password: 'test', _id: '5446f909e4b0efeaa2c1ba8b'} and 
User: {name: 'unittestonly2', password: 'test', _id: '54472a85e4b0efeaa2c1bc02'} are created for testing only
*/

describe('Check User name', function(){
  it('should return 0 when the name is valid', function(){
  	var result = model.checkUser("test");
  	result.should.equal(0);
  });

  it('should return -1 when the name is too long', function(){
  	var name = "1234567890123456789012345678901234567890" +
  			   "1234567890123456789012345678901234567890" +
  			   "1234567890123456789012345678901234567890" +
  			   "1234567890123456789012345678901234567890";
  	var result = model.checkUser(name);
    result.should.equal(-1);
  });

  it('should return -1 when the name is empty', function(){
  	var name = '';
  	var result = model.checkUser(name);
  	result.should.equal(-1);
  });
});

describe('Check Password', function(){
  it('should return 0 when the password is valid', function(){
  	var result = model.checkPwd("test");
  	result.should.equal(0);
  });

  it('should return -2 when the password is too long', function(){
  	var pwd = "1234567890123456789012345678901234567890" +
  			  "1234567890123456789012345678901234567890" +
  			  "1234567890123456789012345678901234567890" +
  			  "1234567890123456789012345678901234567890";
  	var result = model.checkPwd(pwd);
    result.should.equal(-2);
  });

  it('should return 0 when the password is empty', function(){
  	var pwd = '';
  	var result = model.checkPwd(pwd);
  	result.should.equal(0);
  });
});


describe('Create User function', function(){
  it('should return {errCode: 1} when the name and password are both valid and the user doesn\'t exist', function(done){
  	model.add(randomname, 'test125', function(result) {
  	  assert.equal(1, result.errCode);
  	  done();
  	});
  });

  it('should return {errCode: -3} when the user already exists', function(done){
  	model.add(randomname, 'test125', function(result) {
  	  result.should.eql({'errCode': -3});
  	  done();
  	});
  });
});

describe('Login function', function(){
  it('should return {errCode: 1, user_id: x} when the name and password are both valid', function(done){
  	model.login('unittestonly', 'test', function(result) {
  	  assert.equal(1, result.errCode);
      assert.equal('5446f909e4b0efeaa2c1ba8b', result.user_id);
  	  done();
  	});
  });

  it('should return {errCode: -4} when the password is invalid', function(done){
  	model.login('test124', 'test124', function(result) {
  	  result.should.eql({'errCode': -4});
  	  done();
  	});
  });

  it('should return {errCode: -4} when the user doesn\'t exist', function(done){
  	model.login('test123', 'test124', function(result) {
  	  result.should.eql({'errCode': -4});
  	  done();
  	});
  });
});

describe('Search user function', function(){
  it('should return {errCode: 1, users: []} when the name is valid', function(done){
    model.getUserByName('unittest', function(result) {
      assert.equal(1, result.errCode);
      assert.equal(2, result.users.length);
      assert.equal('5446f909e4b0efeaa2c1ba8b', result.users[0].user_id);
      assert.equal('unittestonly', result.users[0].user_name);
      assert.equal('54472a85e4b0efeaa2c1bc02', result.users[1].user_id);
      assert.equal('unittestonly2', result.users[1].user_name);
      done();
    });
  });

  it('should return {errCode: 1, user_name: unittestonly, user_profile: test} when the id exists', function(done){
    model.getUserById('5446f909e4b0efeaa2c1ba8b', function(result) {
      assert.equal(1, result.errCode);
      assert.equal('unittestonly', result.user_name);
      assert.equal('test', result.user_profile);
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