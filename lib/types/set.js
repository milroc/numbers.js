var numbers = require('../numbers'),
	  exports = Set;

//TODO Determine where _getValid and _getValidElement can go.
/**
 * Get the information in a valid form according to the {Set} API.
 *
 * @param {Array|Number} Data or set of elements
 * @param {Object} object to determine which test.
 */
function _getValid(data, obj) {
  if (Set.prototype.isPrototypeOf(obj)) {
    if (Object.prototype.toString.call(data) === '[object Array]') {
      return data; //TODO map getValidElement.
    } else {
      return [data];
    }
  } 
  else {
    throw new Error(obj.constructor + " is currently not supported in _getValid.");
  }
}

/**
 * Get the elements in a valid form according to the {Set} API.
 *
 * @param {Array|Number} Element
 * @param {Object} object to determine which test.
 */
function _getValidElement(d, obj) {
  if (Set.prototype.isPrototypeOf(obj)) {
    // currently only support numbers
    // If hashing is implemented, it should be hashed here and rehashed in toArray
    if (d % 1 === 0) return ''+d;
    else throw new Error(d + " is not a valid element for a Set");
  } 
  else {
    throw new Error(obj.constructor + " is currently not supported in _getValidElement.");
  }
}

/**
 * Core Data Structure for use in numbers.js library.
 * This data structure implements a set (with similar API to 
 * that of python's set data structure). 
 *
 * @param {Number|Array} (optional) values to add to initial Set object.
 */
var Set = function(data) {
	if (arguments.length === 0) {
    this.data = {};
  }
	else {
		data = _getValid(data, this); //returns array
    this.data = {};
    var l = this.length,
        i;
    for (i = 0; i < l; i++) {
      this.add(data[i]);
    }
	}
};

/**
 * Determine if the Set has value(s).
 *
 * @param {Number|Array} Value(s) added to set
 * @return {Boolean|Array} Returns a boolean array or boolean value
 */
Set.prototype.has = function(d) {
  if (Object.prototype.toString.call(d) === '[object Array]') {
    var i, 
        l = d.length,
        ret = [];
    for (i = 0; i < l; i++) {
      ret.push(this.has(d[i]));
    }
    return ret;  
  }
  else {
    d = _getValidElement(d, this);
    return this.data.hasOwnProperty(d);
  }
};

/**
 * Create a copy of the Set.
 *
 * @return {Set} an exact copy of this set.
 */
Set.prototype.clone = function() {
  return new Set(this.toArray()); //TODO proper copy
};

/**
 * Determine if all values in B are in this set.
 *
 * @param {Set|Array} Set B or array to create set from
 * @return {Boolean} true for superset
 */
Set.prototype.isSuperSet = function(B) {
  if (!Set.prototype.isPrototypeOf(B))
    B = new Set(_getValid(B, this));
  return this.has(B.toArray()).reduce(function(a, b) {
    return !!a && !!b;
  });
};

/**
 * Determine if all values in this set are in B.
 *
 * @param {Set|Array} Set B or array to create set from
 * @return {}
 */
Set.prototype.isSubSet = function(B) {
  if (!Set.prototype.isPrototypeOf(B))
    B = new Set(_getValid(B, this));
  return B.has(this.toArray()).reduce(function(a, b) {
    return !!a && !!b;
  });
};

/**
 * Convert this Set to an Array
 *
 * @param {Function} (optional) the function in which to sort the array by
 * @return {Array} Array of elements in set.
 */
Set.prototype.toArray = function(sortFunc) {
  var ret = Object.keys(this.data);
  ret.map(function(a) { return +a; }); //currently supports only numbers
  if (arguments.length === 1) ret.sort(sortFunc);
  return ret;
};

/**
 * Add value(s) to this Set.
 * (A + B)
 *
 * @param {Number|Array} Value(s) added to set
 * @return {Set} Updated Set
 */
Set.prototype.add = function(d) {
  if (Object.prototype.toString.call(d) === '[object Array]') {
    var i, 
        l = d.length;
    for (i = 0; i < l; i++) {
      this.add(d[i]);
    }
  }
  else {
    d = _getValidElement(d, this);
    if (!this.has(d)) {
      this.data[d] = true;
      this.size++;
    }
  }
  return this;
};

/**
 * Remove value(s) from this Set.
 * (A - B)
 *
 * @param {Number|Array} Value(s) removed from set
 * @return {Set} Updated Set
 */
Set.prototype.remove = function(d) {
  if (Object.prototype.toString.call(d) === '[object Array]') {
    var i, 
        l = d.length,
        ret = [];
    for (i = 0; i < l; i++) {
      ret.push(this.remove(d[i]));
    }
    return ret;
  }
  else {
    d = _getValidElement(d, this);
    if (this.has(d)) {
      delete this.data[d];
      this.size--;
      return true;      
    }
    return false;
  }
};

/**
 * Add any elements from B that are not already in A.
 * (A | B)
 *
 * @param {Set|Array} the set or data to create a set from
 * @return {Set} Updated Set
 */
Set.prototype.union = function(B) {
  if (!Set.prototype.isPrototypeOf(B))
    B = new Set(_getValid(B, this));
  return this.add(B.toArray());
};

/**
 * Creates an updated set containing elements which are both in this and in B.
 * (A & B)
 *
 * @param {Set|Array} the set or data to create a set from
 * @return {Set} Updated Set
 */
Set.prototype.intersection = function(B) {
  if (!Set.prototype.isPrototypeOf(B))
    B = new Set(_getValid(B, this));
  var BList = B.toArray(),
      check = this.has(BList),
      i,
      l = BList.length,
      commonList = [];
  for (i = 0; i < l; i++) {
    if (check[i])
      commonList.push(BList[i]);
  }
  this = new Set(commonList);
  return this;
};

/**
 * Removes all elements in this set that are also in set B.
 * (A - B)
 *
 * @param {Set|Array} the set or data to create a set from
 * @return {Set} Updated Set
 */
Set.prototype.difference = function(B) {
  if (!Set.prototype.isPrototypeOf(B))
    B = new Set(_getValid(B, this));
  var AList = this.toArray(),
      check = B.has(AList), //TODO all should also accept sets
      i,
      l = AList.length,
      differenceList = [];
  for (i = 0; i < l; i++) {
    if (!check[i])
      differenceList.push(AList[i]);
  }
  //TODO not right
  this = new Set(differenceList);
  return this;
};

/**
 * Update set to only include elements not in A and not in B.
 * (A | B) - (A & B)
 * A + B - (A & B)
 *
 * @param {Set|Array} the set or data to create a set from
 * @return {Set} Updated Set
 */
Set.prototype.symmetricDifference = function(B) {
  if (!Set.prototype.isPrototypeOf(B))
    B = new Set(_getValid(B, this));
  var BAdded = B.difference(this.clone()
                                .intersection(B))
                .toArray(); //needs to accept sets
  this.difference(this.clone()
                      .intersection(B));
  return this.add(BAdded);
};

/**
 * Non-modified static wrapper of Set.prototype.add()
 *
 * @param {Set|Array} the set or data to create a set from
 * @param {Number|Array} values to add to the set.
 * @return {Set} A copy or created Set with updates made.
 */
Set.add = function(A, d) {
  if (!Set.prototype.isPrototypeOf(A))
    A = new Set(_getValid(A, this));
  return A.clone()
          .add(d);
};

/**
 * Non-modified static wrapper of Set.prototype.remove()
 *
 * @param {Set|Array} the set or data to create a set from
 * @param {Number|Array} values to add to the set.
 * @return {Set} A copy or created Set with updates made.
 */
Set.remove = function(A, d) {
  if (!Set.prototype.isPrototypeOf(A))
    A = new Set(_getValid(A, this));
  var newA = A.clone(),
  newA.remove(d);
  return newA;
};

/**
 * Non-modified static wrapper of Set.prototype.union()
 *
 * @param {Set|Array} the set or data to create a set from
 * @param {Set|Array} the set to union with A, or data to create set from
 * @return {Set} A copy or created Set with updates made.
 */
Set.union = function(A, B) {
  if (!Set.prototype.isPrototypeOf(A))
    A = new Set(_getValid(A, this));
  return A.clone()
          .union(B);
};

/**
 * Non-modified static wrapper of Set.prototype.intersection()
 *
 * @param {Set|Array} the set or data to create a set from
 * @param {Set|Array} the set to union with A, or data to create set from
 * @return {Set} A copy or created Set with updates made.
 */
Set.intersection = function(A, B) {
  if (!Set.prototype.isPrototypeOf(A))
    A = new Set(_getValid(A, this));
  return A.clone()
          .intersection(B);
};

/**
 * Non-modified static wrapper of Set.prototype.union()
 *
 * @param {Set|Array} the set or data to create a set from
 * @param {Set|Array} the set to union with A, or data to create set from
 * @return {Set} A copy or created Set with updates made.
 */
Set.difference = function(A, B) {
  if (!Set.prototype.isPrototypeOf(A))
    A = new Set(_getValid(A, this));
  return A.clone()
          .difference(B);
};

/**
 * Non-modified static wrapper of Set.prototype.union()
 *
 * @param {Set|Array} the set or data to create a set from
 * @param {Set|Array} the set to union with A, or data to create set from
 * @return {Set} A copy or created Set with updates made.
 */



Set.symmetricDifference = function(A, B) {
  if (!Set.prototype.isPrototypeOf(A))
    A = new Set(_getValid(A, this));
  return A.clone()
          .symmetricDifference(B);
};