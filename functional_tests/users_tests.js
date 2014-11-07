var assert = require('assert');
var should = require('should');
var request = require('supertest');

require('../test_variables');

var url = 'http://yana169.herokuapp.com';
//var url = '127.0.0.1:3000';

// Generate a random name for each test
var randomname = Math.floor((Math.random() * 10000) + 1);
var cookies;

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


		it('should return errCode=-2 when password is empty', function(done) {
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
					res.body.errCode.should.equal(-2);
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
					cookies = res.headers['set-cookie'];
					done();
				});
		});

	});

	describe('Search User By ID Test', function() {
		it('should return errCode=1, the user\'s name and profile when user_id exists', function(done) {
			request(url)
				.get('/users/search_users_by_id/' + global.test_user1_id)
				.set('Cookie', cookies)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err2, res2) {
					if (err2)　{
						throw err2;
					}
					res2.body.errCode.should.equal(1);
					res2.body.username.should.equal(global.test_user1);
					done();
				});
		});

		it('should return errCode=-5 when user_id doesn\'t exist', function(done) {
			request(url)
				.get('/users/search_users_by_id/notexist')
				.set('Cookie', cookies)
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
				.set('Cookie', cookies)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.users.length.should.equal(4);
					done();
				});
		});

		it('should return errCode=1 and an empty list when similar user_name doesn\'t exist', function(done) {
			request(url)
				.get('/users/search_users_by_name/unittestonly12345')
				.set('Cookie', cookies)
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
				.set('Cookie', cookies)
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

	describe('Edit User Profile Test', function() {
		it('should return errCode=1 when user_id equals to the id stored in session', function(done) {
			var body = {
				user_id : global.test_user1_id,
				age : 39,
				gender : 'Male',
				about : 'YANA is great',
				privacy : 0
			};
			request(url)
				.post('/users/edit_profile/')
				.set('Cookie', cookies)
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

		it('should return errCode=-11 when user_id is not the logged-in user', function(done) {
			var body = {
				user_id : global.test_user2_id,
				age : 39
			};
			request(url)
				.post('/users/edit_profile/')
				.set('Cookie', cookies)
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(-11);
					done();
				});
		});
	});

	describe('Get User Profile Test', function() {
		it('should return errCode=1 and the user\'s profile when user_id equals to target_id', function(done) {
			request(url)
				.get('/users/profile/' + global.test_user1_id + '/' + global.test_user1_id)
				.set('Cookie', cookies)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.profile.username.should.equal(global.test_user1);
					res.body.profile.age.should.equal(39);
					res.body.profile.gender.should.equal('Male');
					done();
				});
		});

		it('should return errCode=1 and the user\'s name and about when target_id\'s privacy setting is private', function(done) {
			request(url)
				.get('/users/profile/' + global.test_user1_id + '/' + global.test_user2_id)
				.set('Cookie', cookies)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					Object.keys(res.body.profile).length.should.equal(2);
					done();
				});
		});

		it('should return errCode=1 and the user\'s whole profile when target_id\'s privacy setting is public', function(done) {
			request(url)
				.get('/users/profile/' + global.test_user1_id + '/' + global.test_user3_id)
				.set('Cookie', cookies)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.profile.should.have.property("username");
					res.body.profile.should.have.property("about");
					res.body.profile.should.have.property("age");
					done();
				});
		});

		it('should return errCode=1 and the user\'s whole profile when target_id\'s privacy setting is friend while they are friends', function(done) {
			// Friend user1 and user4 first
			request(url)
				.post('/friends/add_friend')
				.set('Cookie', cookies)
				.send({ "to_id" : global.test_user1_id, "from_id" : global.test_user4_id })
				.end(function(err) {
					if (err)
						throw err;
					request(url)
						.get('/users/profile/' + global.test_user1_id + '/' + global.test_user4_id)
						.set('Cookie', cookies)
						.expect('Content-Type', /json/)
						.expect(200)
						.end(function(err, res) {
							if (err)　{
								throw err;
							}
							res.body.errCode.should.equal(1);
							res.body.profile.should.have.property("username");
							res.body.profile.should.have.property("about");
							res.body.profile.should.have.property("age");
							request(url)
								.post('/friends/delete_friend')
								.set('Cookie', cookies)
								.send({ "to_id" : global.test_user1_id, "from_id" : global.test_user4_id })
								.end(function(err) {
									if (err)
										throw err;
									done();
								});
						});
				});
		});	

		it('should return errCode=1 and the user\'s name and about when target_id\'s privacy setting is friend while they are not friends', function(done) {
			request(url)
				.get('/users/profile/' + global.test_user1_id + '/' + global.test_user4_id)
				.set('Cookie', cookies)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err)　{
						throw err;
					}
					res.body.errCode.should.equal(1);
					res.body.profile.should.have.property("username");
					res.body.profile.should.have.property("about");
					Object.keys(res.body.profile).length.should.equal(2);
					done();
				});
		});
	});		
});