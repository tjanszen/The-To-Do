/* jshint expr:true */

'use strict';

var expect = require('chai').expect;
var User = require('../../server/models/user');
var Item = require('../../server/models/item');
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var beforeEach = lab.beforeEach;
var server = require('../../server/index');
var cookie;
var bob;
require('../../server/index');

describe('Item', function() {
  beforeEach(function(done) {
    User.remove(function() {
      User.register({email:'b@c.d', password:'1234'}, function(err, user) {
        bob = user;
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
  describe('constructor', function() {
    it('should create a new item', function(done) {
      var item = new Item({
        title:'Title',
        due:'2015-02-25',
        tags:['banana','apple'],
        priority:'High',
        userId: bob._id
      });
      expect(item.title).to.equal('Title');
      expect(item.tags).to.contain(['banana']);
      expect(item.priority).to.equal('High');
      expect(item.userId).to.equal(bob._id);
      expect(item.due).to.be.a('date');
      expect(item.createdAt).to.be.a('date');
      done();
    });
  });
});
