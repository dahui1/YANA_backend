var assert = require('assert');
var should = require('should');
var request = require('supertest');

require('../test_variables');

var url = 'http://yana169.herokuapp.com';

// Generate a random name for each test
var randomname = Math.floor((Math.random() * 10000) + 1);

describe('Users Test', function() {
	describe('Create Account Test', function() {
		it('should return errCode=1 and the user id when username and password are valid', function(done) {
			var body = {
				username : randomname,
				password : 'test'
			};
			request(url)
				.post('/users/create_user')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.should.have.property('user_id');
					done();
				});
		});

		it('should return errCode=-1 when username is empty', function(done) {
			var body = {
				username : '',
				password : 'test'
			};
			request(url)
				.post('/users/create_user')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-1);
					done();
				});
		});

		it('should return errCode=-1 when username is too long', function(done) {
			var body = {
				username : '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
				password : 'test'
			};
			request(url)
				.post('/users/create_user')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-1);
					done();
				});
		});


		it('should return errCode=1 when password is empty', function(done) {
			var r = Math.floor((Math.random() * 10000) + 1);

			var body = {
				username : r,
				password : ''
			};
			request(url)
				.post('/users/create_user')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.should.have.property('user_id');
					done();
				});
		});

		it('should return errCode=-2 when password is too long', function(done) {
			var body = {
				username : 'test',
				password : '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789'
			};
			request(url)
				.post('/users/create_user')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-2);
					done();
				});
		});

		it('should return errCode=-3 when username exists', function(done) {
			var body = {
				username : randomname,
				password : 'test'
			};
			request(url)
				.post('/users/create_user')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-3);
					done();
				});
		});
	});

	describe('Login Test', function() {
		it('should return errCode=1 and the user id when username exits and password is correct', function(done) {
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
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.should.have.property('user_id');
					res.body.user_id.should.equal(global.test_user1_id);
					done();
				});
		});

		it('should return errCode=-4 when username doesn\'t exist', function(done) {
			var body = {
				username : randomname + 100000000,
				password : 'test'
			};
			request(url)
				.post('/users/login')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-4);
					done();
				});
		});

		it('should return errCode=-4 when password is incorrect', function(done) {
			var body = {
				username : randomname,
				password : 'wrongpassword'
			};
			request(url)
				.post('/users/login')
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-4);
					done();
				});
		});
	});

	describe('Search User By ID Test', function() {
		it('should return errCode=1, the user\'s name and profile when user_id exists', function(done) {
			request(url)
				.get('/users/search_users_by_id/' + global.test_user1_id)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.username.should.equal(global.test_user1);
					res.body.profile.should.equal('test');
					done();
				});
		});

		it('should return errCode=-5 when user_id doesn\'t exist', function(done) {
			request(url)
				.get('/users/search_users_by_id/notexist')
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
	});

	describe('Search User By Name Test', function() {
		it('should return errCode=1, a list of user\'s ids, names and profiles when similar user_name exists', function(done) {
			request(url)
				.get('/users/search_users_by_name/' + global.test_user1)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.users.length.should.equal(2);
					res.body.users[0].user_id.should.equal(global.test_user1_id);
					res.body.users[0].username.should.equal(global.test_user1);
					res.body.users[1].user_id.should.equal(global.test_user2_id);
					res.body.users[1].username.should.equal(global.test_user2);
					done();
				});
		});

		it('should return errCode=1 and an empty list when similar user_name doesn\'t exist', function(done) {
			request(url)
				.get('/users/search_users_by_name/unittestonly12345')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.users.length.should.equal(0);
					done();
				});
		});


		it('should return errCode=1 and an empty list when username is empty', function(done) {
			request(url)
				.get('/users/search_users_by_name/')
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.users.length.should.equal(0);
					done();
				});
		});
	});
});