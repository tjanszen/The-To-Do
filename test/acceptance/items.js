/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var User = require('../../server/models/user');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var server = require('../../server/index');
var cookie;
require('../../server/index');

describe('items route', function() {
  beforeEach(function(done) {
    User.remove(function() {
      User.register({email:'b@c.d', password:'1234'}, function() {
        var options = {
          method: 'post',
          url:'/authenticate',
          payload:{
            email:'b@c.d',
            password: '1234'
          }
        };
        server.inject(options, function(response) {
          cookie = response.headers['set-cookie'][0].match(/snickerdoodle=[^;]+/)[0];
          done();
        });
      });
    });
  });
  describe('get /items/new', function() {
    it('should display the new item page', function(done) {
      var options = {
        method: 'get',
        url:'/items/new',
        headers: {
          cookie: cookie  
        }
      };
      server.inject(options, function(response) {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.include('New Item');
        done();
      });
    });
  });
  it('should create a new item', function(done) {
    var options = {
      method: 'post',
      url:'/items',
      payload:{
        title:'Title',
        due:'2015-02-25',
        tags:'oNe, & two, &* thRee',
        priority:'High',
      },
      headers: {
        cookie: cookie  
      }
    };
    server.inject(options, function(response) {
      expect(response.statusCode).to.equal(302);
      expect(response.headers.location).to.equal('/items');
      done();
    });
  });
  it('should NOT create a new item - Joi validation failure', function(done) {
    var options = {
      method: 'post',
      url:'/items',
      payload:{
        title:'',
        due:'2015-02-25',
        tags:'oNe, & two, &* thRee',
        priority:'High',
      },
      headers: {
        cookie: cookie  
      }
    };
    server.inject(options, function(response) {
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
});
