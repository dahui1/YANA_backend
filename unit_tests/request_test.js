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
      [global.test_user2],
      "meal type",
      "time",
      "restaurant",
      "comment", function(result) {
        assert.equal(1, result.errCode);
        assert.notEqual(result.request_id, undefined);
        done();
      }
    );
  });

  it('should return {errCode: -8} when not all params are provided', function(done) {
    var poo = model.createRequest(
      global.test_user1_id,
      [global.test_user2],
      "meal type",
      "time",
      "comment").errCode;

    assert.equal(poo, -8);
  });
});

describe('Get Request List', function() {
});

describe('Handle Request', function() {
});
