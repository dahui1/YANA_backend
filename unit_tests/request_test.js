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
      global.test_user1,
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
});

describe('Get Request List', function() {
  it('should return {errCode: 1, requests}', function() {
    model.getRequests(test_user1_id,
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
      test_user2_id,
      "545d67cfc2127356191b48bf",
      "accept",
      function(result) {
        assert.equal(result.errCode, 1);
        assert.equal(result.request_id, "545d67cfc2127356191b48bf");
        done();
    });
  });

  it('should return {errCode: 1, request_id} on deny', function() {
    model.handleRequest(
      test_user2_id,
      "545d67cfc2127356191b48bf",
      "decline",
      function(result) {
        assert.equal(result.errCode, 1);
        assert.equal(result.request_id, "545d67cfc2127356191b48bf");
        done();
    });
  });
});

describe('Push formatting', function() {
  it ('should output properly formatted time for push', function() {
    function unixToPretty(unix_time) {
      var date = new Date(parseInt(unix_time) * 1000);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var tail = "AM"
      if (hours > 12) {
        tail = "PM";
        hours -= 12;
      }
      hours = hours.toString()
      if (minutes < 10) {
        minutes = "0" + minutes.toString();
      }
      else {
        minutes = minutes.toString();
      }
      var pretty = hours + ":" + minutes + " " + tail;
      return pretty;
    }

    assert.equal(unixToPretty("1418022432"), "11:07 PM");
    assert.equal(unixToPretty("1418011332"), "8:02 PM");
    assert.equal(unixToPretty("1418017732"), "9:48 PM");
    assert.equal(unixToPretty("1417807732"), "11:28 AM");
    assert.equal(unixToPretty("1417799000"), "9:03 AM");
  })
});

