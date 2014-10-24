var assert = require('assert');
var should = require('should');
var request = require('supertest');

require('../test_variables');

var url = 'http://yana169.herokuapp.com';

// Generate a random name for each test
var randomname = Math.floor((Math.random() * 10000000) + 1);

describe('Request Test', function() {
    describe('Create Meal Request', function() {
        it('should return {errCode: 1} and request_id when all params are provided', function(done) {
            var body = {
                user_id: global.test_user1_id,
                invitations: [global.test_user2_id],
                meal_type: "meal type",
                meal_time: "time",
                restaurant: "restaurant",
                comment: "comment"
            };
            request(url)
                .post('/request/create_request')
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err)　{
                        throw err;
                    }
                    res.body.errCode.should.equal(1);
                    // res.body.should.have.property('user_id');
                    done();
                });
        });
    });
});