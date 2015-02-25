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

describe('sort route', function() {
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
    it('should filter by due date ascending', function(done) {
      var options = {
        method: 'get',
        url: '/items?sort=due&limit=1',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('High1N');
        done();
      });
    });
    it('should filter by due date descending', function(done) {
      var options = {
        method: 'get',
        url: '/items?sort=-due',
        headers: {
          cookie: cookie
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('High2N');
        done();
      });
    });
  });
});
