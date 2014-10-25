var express = require('express');
var assert = require('assert');

var app = require('../app');
var model = require('../model/request_model');

require('../test_variables');
/*
User: {name: 'unittestonly', password: 'test', _id: global.test_user1_id} and
User: {name: 'unittestonly2', password: 'test', _id: global.test_user2_id} are created for testing only
*/

describe('Create Meal Request', function() {
  it('should return {errCode: 1} and request_id when all params are provided', function(done) {
    model.createRequest(
      global.test_user1_id,
      [global.test_user2_id],
      "meal type",
      "1414178401",
      "restaurant",
      "comment", function(result) {
        assert.equal(1, result.errCode);
        assert.notEqual(result.request_id, undefined);
        done();
      });
  });

  it('should return {errCode: -8} when not all params are provided', function(done) {
    var err = model.createRequest(
      global.test_user1_id,
      [global.test_user2_id],
      "meal type",
      "time",
      "comment").errCode;

    assert.equal(err, -8);
  });
});

describe('Get Request List', function() {
  it('should return {errCode: 1, requests}', function() {
    model.getRequests('5449b4c8adaabc6335ed9f2a',
      function(result) {
        assert.equal(result.errCode, 1);
        assert.equal(result.requests.length, 0);
        done();
      });
  });
});

describe('Handle Request', function() {
  it('should return {errCode: 1, request_id} on accept', function() {
    model.handleRequest(
      "5449c0f3e4b0bec4bf235a28",
      "5449b4c8adaabc6335ed9f2a",
      "accept",
      function(result) {
        assert.equal(result.errCode, 1);
        assert.equal(result.request_id, "5449b4c8adaabc6335ed9f2a");
        done();
    });
  });

  it('should return {errCode: 1, request_id} on deny', function() {
    model.handleRequest(
      "5449c0f3e4b0bec4bf235a28",
      "5449b4c8adaabc6335ed9f2a",
      "decline",
      function(result) {
        assert.equal(result.errCode, 1);
        assert.equal(result.request_id, "5449b4c8adaabc6335ed9f2a");
        done();
    });
  });
});
