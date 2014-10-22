var assert = require('assert');
var should = require('should');
var request = require('supertest');

var url = 'http://yana169.herokuapp.com';

require('../test_variables');

// Generate a random name for each test
var randomname = Math.floor((Math.random() * 10000) + 1);

describe('Friends Test', function() {
	describe('Add Friends Test', function() {
		it('should return errCode=1 when both users exist and B haven\'t followed A', function(done) {
			var body = {
				to_id : global.test_user1_id,
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/add_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					done();
				});
		});

		it('should return errCode=-5 when user A doesn\'t exist', function(done) {
			var body = {
				to_id : 'notexist',
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/add_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-5);
					done();
				});
		});

		it('should return errCode=-5 when user B doesn\'t exist', function(done) {
			var body = {
				to_id : global.test_user1_id,
				from_id : 'notexist'
			};
			request(url)
				.post('/friends/add_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-5);
					done();
				});
		});

		it('should return errCode=-6 when B already followed A', function(done) {
			var body = {
				to_id : global.test_user1_id,
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/add_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-6);
					done();
				});
		});
	});

	describe('Delete Friends Test', function() {
		it('should return errCode=1 when both users exist and B already followed A', function(done) {
			var body = {
				to_id : global.test_user1_id,
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/delete_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					done();
				});
		});

		it('should return errCode=-5 when user A doesn\'t exist', function(done) {
			var body = {
				to_id : 'notexist',
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/delete_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-5);
					done();
				});
		});

		it('should return errCode=-5 when user B doesn\'t exist', function(done) {
			var body = {
				to_id : global.test_user1_id,
				from_id : 'notexist'
			};
			request(url)
				.post('/friends/delete_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-5);
					done();
				});
		});

		it('should return errCode=-6 when B hasn\'t followed A', function(done) {
			var body = {
				to_id : global.test_user1_id,
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/delete_friend')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-12);
					done();
				});
		});
	});
});