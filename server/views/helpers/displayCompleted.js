'use strict';

var Item = require('../../models/item');

module.exports = function displayCompleted(item) {
   if(item.isCompleted) {
     return "<i class='fa fa-check-square-o'></i>";
   } else {
     return "<i class='fa fa-square-o'></i>";
   }
};
