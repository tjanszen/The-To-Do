'use strict';

var Item = require('../../models/item');
// var _ = require('lodash');
var moment = require('moment');
var additionMe = require('../../views/helpers/additionMe');

module.exports = {
  handler: function(request, reply) {
    request.query.userId = request.auth.credentials._id;
    var page = request.query.page || 1;
    var limit = request.query.limit || 5;
    var skip = (page - 1) * limit;
    var newSkip = request.query.skip || 0;
    var sort = request.query.sort || {};
    delete request.query.skip;
    delete request.query.page;
    delete request.query.limit;
    delete request.query.sort;

    // var filter = _.merge(request.query, {userId:request.auth.credentials._id});
    Item.find(request.query).sort(sort).skip(newSkip).limit(limit).exec(function(err, items) {
      reply.view('templates/items/index', {items:items, moment:moment, additionMe:additionMe, skip:skip, limit:limit, newSkip:newSkip});
    });
  }
};
