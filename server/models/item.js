'use strict';

var mongoose = require('mongoose');
var _ = require('lodash');

var itemSchema = mongoose.Schema({
  title: {type: String, required: true},
  due: {type: Date, required:true},
  createdAt: {type: Date, default: Date.now, required:true},
  tags: [String],
  priority: {type: String, required: true},
  userId: {type: mongoose.Schema.ObjectId, ref: 'User'},
  isCompleted: {type: Boolean, default: false, required: true}
});

itemSchema.pre('save', function(next) {
  if(this.isNew){
    this.tags = _.kebabCase(this.tags[0].toLowerCase()).split('-');
  }
  next();
});

module.exports = mongoose.model('Item', itemSchema);
