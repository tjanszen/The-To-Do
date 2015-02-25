'use strict';

var Item = require('../../models/item');
var _ = require('lodash');

module.exports = {
  handler: function(request, reply) {
    var page = request.query.page || 1;
    var limit = request.query.limit || 5;
    var skip = (page - 1) * limit;
    var sort = request.query.sort || {};
    delete request.query.page;
    delete request.query.limit;
    delete request.query.sort;
    var filter = _.merge(request.query, {userId:request.auth.credentials._id});
    Item.find(filter).sort(sort).skip(skip).limit(limit).exec(function(err, items) {
      reply.view('templates/items/index', {items:items});
    });
  }
};
