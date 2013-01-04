var numbers = require('../numbers');
var create = exports;

create.Set = function(data) {
	var s = new Set();
  return s.add(data);
};