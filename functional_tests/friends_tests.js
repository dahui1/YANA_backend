var assert = require('assert');
var should = require('should');
var request = require('supertest');

var url = 'http://yana169.herokuapp.com';
var cookies;

require('../test_variables');

// Generate a random name for each test
var randomname = Math.floor((Math.random() * 10000) + 1);

describe('Friends Test', function() {
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

	describe('Add Friends Test', function() {
		it('should return errCode=1 when both users exist and B haven\'t followed A', function(done) {
			var body = {
				to_id : global.test_user1_id,
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/add_friend')
                .set('Cookie', cookies)
				.send(body)
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

		it('should return errCode=-5 when user A doesn\'t exist', function(done) {
			var body = {
				to_id : 'notexist',
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/add_friend')
                .set('Cookie', cookies)
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
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
                .set('Cookie', cookies)
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
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
                .set('Cookie', cookies)
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
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
                .set('Cookie', cookies)
				.send(body)
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

		it('should return errCode=-5 when user A doesn\'t exist', function(done) {
			var body = {
				to_id : 'notexist',
				from_id : global.test_user2_id
			};
			request(url)
				.post('/friends/delete_friend')
                .set('Cookie', cookies)
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
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
                .set('Cookie', cookies)
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
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
                .set('Cookie', cookies)
				.send(body)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					res.body.errCode.should.equal(-12);
					done();
				});
		});
	});

	describe('Get friend list function', function() {
		it ('should return {errCode: 1} when getting friends of a valid user', function(done) {
			request(url)
				.get('/friends/friend_list/' + global.test_user1_id)
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

	describe('Get friend requests function', function() {
		it ('should return {errCode: 1} when getting friends of a valid user', function(done) {
			request(url)
				.get('/friends/friend_requests/' + global.test_user1_id)
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

  describe('Block user function', function() {
    it ('should return {errCode: 1} when successfully block user', function(done) {
      var body = {
        user_id : global.test_user1_id,
        block_id : global.test_user2_id
      };

      request(url)
        .post('/friends/block_user')
        .set('Cookie', cookies)
        .send(body)
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

    it ('should show up in friends before block, not show up after block', function(done) {
      request(url)
        .get('/friends/friend_requests/' + global.test_user1_id)
        .set('Cookie', cookies)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.body.errCode.should.equal(1);
          res.body.friends.length.should.equal(0);
          done();
        });
    })
  });
});