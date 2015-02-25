/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var server = require('../../server/index');
var cp = require('child_process');
var dbname = process.env.MONGO_URL.split('/')[3];
var cookie;

describe('filter route', function() {
  beforeEach(function(done) {
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [dbname], {cwd:__dirname + '/../scripts'}, function() {
      var options = {
        method: 'post',
        url:'/authenticate',
        payload:{
          email:'e@f.g',
          password: '1234'
        }
      };
      server.inject(options, function(response) {
        cookie = response.headers['set-cookie'][0].match(/snickerdoodle=[^;]+/)[0];
        done();
      });
    });
  });
  describe('items filter', function() {
    it('should filter high priority completed items', function(done) {
      var options = {
        method: 'get',
        url: '/items?isCompleted=true&priority=High',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('High4C');
        done();
      });
    });
    it('should filter medium priority uncompleted items', function(done) {
      var options = {
        method: 'get',
        url: '/items?isCompleted=false&priority=Medium',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('Medium2N');
        done();
      });
    });
    it('should limit to first page items', function(done) {
      var options = {
        method: 'get',
        url: '/items?page=1',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('High1N');
        expect(response.payload).to.not.include('Medium5C');
        done();
      });
    });
    it('should limit to the first item', function(done) {
      var options = {
        method: 'get',
        url: '/items?sort=due&page=1&limit=1',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('High1N');
        expect(response.payload).to.not.include('High4C');
        done();
      });
    });
    it('should limit to the second page', function(done) {
      var options = {
        method: 'get',
        url: '/items?page=2',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('Low3C');
        expect(response.payload).to.include('Low6N');
        expect(response.payload).to.not.include('Medium3N');
        done();
      });
    });
  });
});
