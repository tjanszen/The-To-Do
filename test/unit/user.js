/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var User = require('../../server/models/user');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
require('../../server/index');

describe('User', function() {
  beforeEach(function(done) {
    User.remove(function() {
      User.register({email: 'test@test.test', password:'123'}, done);
    });
  });
  describe('register', function() {
    it('should register a user', function(done) {
      User.register({email: 'test2@test.test', password:'123'}, function(err, user) {
        expect(err).to.not.be.ok;
        expect(user.email).to.equal('test2@test.test');
        expect(user.password).to.have.length(60);
        expect(user.createdAt).to.be.instanceOf(Date);
        expect(user._id).to.be.ok;
        expect(user).to.be.ok;
        done();
      });
    });
    it('should NOT register a user - duplicate email', function(done) {
      User.register({email: 'test@test.test', password:'123'}, function(err, user) {
        expect(err).to.be.ok;
        expect(user).to.not.be.ok;
        done();
      });
    });
  });
  describe('authenticate', function() {
    it('should authenticate correct email/pw', function(done) {
      User.authenticate({email:'test@test.test', password:'123'}, function(err, user) {
        expect(err).to.not.be.ok;
        expect(user.email).to.equal('test@test.test');
        expect(user.password).to.have.length(60);
        done();
      });
    });
  });
});
