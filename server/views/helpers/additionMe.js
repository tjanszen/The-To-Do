'use strict';

module.exports = function additionMe(x, y) {
  var sum = parseInt(x) + parseInt(y);
   if(sum < 0) {
     sum  = 0;
   }
   return sum;
};
