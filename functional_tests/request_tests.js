var assert = require('assert');
var should = require('should');
var request = require('supertest');

require('../test_variables');

var url = 'http://yana169.herokuapp.com';

var cookies;

var test_request_id;

// Generate a random name for each test
var randomname = Math.floor((Math.random() * 10000000) + 1);

describe('Request Test', function() {
    it('Log in before all tests', function(done) {
        var body = {
            username : global.test_user1,
            password : 'test'
        };
        request(url)
            .post('/users/login')
            .send(body)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.body.errCode.should.equal(1);
                res.body.should.have.property('user_id');
                res.body.user_id.should.equal(global.test_user1_id);
                cookies = res.headers['set-cookie'];
                done();
            });
    });

    describe('Create Meal Request', function() {
        it('should return {errCode: 1} and request_id when all params are provided', function(done) {
            var body = {
                user_id: global.test_user1_id,
                invitations: [global.test_user2_id],
                meal_type: "meal type",
                meal_time: "1414178401",
                restaurant: "restaurant",
                comment: "comment"
            };
            request(url)
                .post('/request/create_request')
                .set('Cookie', cookies)
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.errCode.should.equal(1);
                    res.body.should.have.property('request_id');
                    test_request_id = res.body.request_id;
                    done();
                });
        });
    });

    describe('Get Meal Request List', function() {
        it('should return {errCode: 1} and list of requests', function(done) {
            request(url)
                .get('/request/request_list/' + global.test_user1_id)
                .set('Cookie', cookies)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.errCode.should.equal(1);
                    done();
                });
        });
    });

    describe('Handle Meal Request', function() {
        it('should return {errCode: 1} and request_id on decline', function(done) {
            var body = {
                user_id: global.test_user2_id,
                request_id: test_request_id,
                action: "decline"
            };
            request(url)
                .post('/request/handle_request')
                .set('Cookie', cookies)
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.errCode.should.equal(1);
                    res.body.request_id.should.equal(test_request_id);
                    done();
                });
        });

        it('should return {errCode: 1} and request_id on accept', function(done) {
            var body = {
                user_id: global.test_user2_id,
                request_id: test_request_id,
                action: "accept"
            };
            request(url)
                .post('/request/handle_request')
                .set('Cookie', cookies)
                .send(body)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.errCode.should.equal(1);
                    res.body.request_id.should.equal(test_request_id);
                    done();
                });
        });
    });
});