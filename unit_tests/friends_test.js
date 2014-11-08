var express = require('express');
var assert = require('assert');

var app = require('../app');
var model = require('../model/friends_model');

require('../test_variables');
/*
User: {name: 'unittestonly', password: 'test', _id: global.test_user1_id} and
User: {name: 'unittestonly2', password: 'test', _id: global.test_user2_id} are created for testing only
*/

describe('Add friend function', function(){
  it('should return {errCode: 1} when both users exist and B hasn\'t followed A', function(done){
  	model.follow(global.test_user1_id, global.test_user2_id, function(result) {
  	  assert.equal(1, result.errCode);
  	  done();
  	});
  });

  it('should return {errCode: -5} when the user A doesn\'t exist', function(done){
    model.follow('notexist', global.test_user2_id, function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -5} when the user B doesn\'t exist', function(done){
    model.follow(global.test_user1_id, 'notexist', function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -6} when B already followed A', function(done){
    model.follow(global.test_user1_id, global.test_user2_id, function(result) {
      assert.equal(-6, result.errCode);
      done();
    });
  });
});

describe('Delete friend function', function(){
  it('should return {errCode: 1} when both users exist and B already followed A', function(done){
    model.unfollow(global.test_user1_id, global.test_user2_id, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it('should return {errCode: -5} when the user A doesn\'t exist', function(done){
    model.unfollow('notexist', global.test_user2_id, function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -5} when the user B doesn\'t exist', function(done){
    model.unfollow(global.test_user1_id, 'notexist', function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -12} when B hasn\'t followed A', function(done){
    model.unfollow(global.test_user1_id, global.test_user2_id, function(result) {
      assert.equal(-12, result.errCode);
      done();
    });
  });
});

describe('Get friend list function', function() {
  it ('should return {errCode: 1} when getting friends of a valid user', function(done) {
    model.getFriends(global.test_user_id, function(result) {
      assert.equal(1, result.errCode);
      assert.notEqual(undefined, result.friends);
      done();
    });
  });
});

describe('Get friend requests function', function() {
  it ('should return {errCode: 1} when getting friend reuqests of a valid user', function(done) {
    model.getFriends(global.test_user_id, function(result) {
      assert.equal(1, result.errCode);
      assert.notEqual(undefined, result.friends);
      assert.equal(0, result.friends.length);
      done();
    });
  });
});

describe('Block user function', function() {
  it ('should return {errCode: 1} on successful block friend', function(done) {
    model.blockUser(global.test_user_id, global.test_user2_id, function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });
});

