var express = require('express');
var assert = require('assert');
var should = require('should');

var app = require('../app');
var model = require('../model/friends_model');

/*
User: {name: 'unittestonly', password: 'test', _id: '5446f909e4b0efeaa2c1ba8b'} and 
User: {name: 'unittestonly2', password: 'test', _id: '54472a85e4b0efeaa2c1bc02'} are created for testing only
*/

describe('Add friend function', function(){
  it('should return {errCode: 1} when both users exist and B haven\'t followed A', function(done){
  	model.follow('5446f909e4b0efeaa2c1ba8b', '54472a85e4b0efeaa2c1bc02', function(result) {
  	  assert.equal(1, result.errCode);
  	  done();
  	});
  });

  it('should return {errCode: -5} when the user A doesn\'t exist', function(done){
    model.follow('notexist', '54472a85e4b0efeaa2c1bc02', function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -5} when the user B doesn\'t exist', function(done){
    model.follow('5446f909e4b0efeaa2c1ba8b', 'notexist', function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -6} when B already followed A', function(done){
    model.follow('5446f909e4b0efeaa2c1ba8b', '54472a85e4b0efeaa2c1bc02', function(result) {
      assert.equal(-6, result.errCode);
      done();
    });
  });
});

describe('Delete friend function', function(){
  it('should return {errCode: 1} when both users exist and B already followed A', function(done){
    model.unfollow('5446f909e4b0efeaa2c1ba8b', '54472a85e4b0efeaa2c1bc02', function(result) {
      assert.equal(1, result.errCode);
      done();
    });
  });

  it('should return {errCode: -5} when the user A doesn\'t exist', function(done){
    model.unfollow('notexist', '54472a85e4b0efeaa2c1bc02', function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -5} when the user B doesn\'t exist', function(done){
    model.unfollow('5446f909e4b0efeaa2c1ba8b', 'notexist', function(result) {
      assert.equal(-5, result.errCode);
      done();
    });
  });

  it('should return {errCode: -12} when B haven\'t followed A', function(done){
    model.unfollow('5446f909e4b0efeaa2c1ba8b', '54472a85e4b0efeaa2c1bc02', function(result) {
      assert.equal(-12, result.errCode);
      done();
    });
  });
});
