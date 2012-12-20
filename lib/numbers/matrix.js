var matrix = exports;

/**
 * Add two matrices together.  Matrices must be of same dimension.
 *
 * @param {Array} matrix A
 * @param {Array} matrix B
 * @return {Array} summed matrix.
 */
matrix.addition = function (arrA, arrB) {
  if ((arrA.length === arrB.length) && (arrA[0].length === arrB[0].length)) {
    var result = new Array(arrA.length);
    
    for (var i = 0; i < arrA.length; i++) {
      result[i] = new Array(arrA[i].length);
    
      for (var j = 0; j < arrA[i].length; j++) {
        result[i][j] = arrA[i][j] + arrB[i][j];
      }
    }

    return result;
  } else {
    throw new Error('Matrix mismatch');
  }
};


/**
 * Scalar multiplication on an matrix.
 *
 * @param {Array} matrix
 * @param {Number} scalar
 * @return {Array} updated matrix
 */
matrix.scalar = function (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      arr[i][j] = val * arr[i][j];
    }
  }
  return arr;
};


/**
 * Transpose a matrix
 *
 * @param {Array} matrix
 * @return {Array} transposed matrix.
 */
matrix.transpose = function (arr) {
  var result = new Array(arr[0].length);
  
  for (var i = 0; i < arr[0].length; i++) {
    result[i] = new Array(arr.length);
    
    for (var j = 0; j < arr.length; j++){
      result[i][j] = arr[j][i];
    }
  }
  return result;
};


/**
 * Create an identity matrix of dimension n x n.
 *
 * @param {Number} dimension of the identity array to be returned
 * @return {Array} n x n identity matrix.
 */
matrix.identity = function (n) {
  var result = new Array(n);
  for (var i = 0 ; i < n ; i++) {
    result[i] = new Array(n);
    for (var j = 0 ; j < n ; j++) {
      result[i][j] = (i === j) ? 1 : 0;
    }
  }
  return result;
};


/**
 * Evaluate dot product of two vectors.  Vectors must be of same length.
 *
 * @param {Array} vector
 * @param {Array} vector
 * @return {Array} dot product
 */
matrix.dotproduct = function (vectorA, vectorB) {
  if (vectorA.length === vectorB.length) {
    var result = 0;
    for (var i = 0 ; i < vectorA.length ; i++) {
      result += vectorA[i] * vectorB[i];
    }
    return result;
  } else {
    throw new Error("Vector mismatch");
  }
};


/**
 * Multiply two matrices. They must abide by standard matching.
 *
 * e.g. A x B = (m x n) x (n x m), where n, m are integers who define
 * the dimensions of matrices A, B.
 *
 * @param {Array} matrix
 * @param {Array} matrix
 * @return {Array} result of multiplied matrices
 */
matrix.multiply = function (arrA, arrB) {
  if (arrA[0].length === arrB.length) {
    var result = new Array(arrA.length);
    
    for (var x = 0 ; x < arrA.length ; x++) {
      result[x] = new Array(arrB[0].length);
    }

    var arrB_T = matrix.transpose(arrB);
    
    for (var i = 0 ; i < result.length ; i++) {
      for (var j = 0 ; j < result[i].length ; j++) {
        result[i][j] = matrix.dotproduct(arrA[i],arrB_T[j]);
      }
    }
    return result;
  } else {
    throw new Error("Array mismatch");
  }
};


/**
 * Evaluate determinate of matrix.  Expect speed
 * degradation for matrices over 4x4. 
 *
 * @param {Array} matrix
 * @return {Number} determinant
 */
matrix.determinant = function (m) {
  var numRow = m.length;
  var numCol = m[0].length;

  if ((numRow === 2) && (numCol === 2)) {
    // If it is a 2*2, run a quick determinant
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  }
  
  // TODO: For matrices of 1 dimension, return a sum of elements

  // For non-2*2 determinants:
  // Uses diagonals to complete the determinant

  var det = 0; // Inititalize a zero determinant

  var row, col; // Intialize indices for the row and column outside the loop
  var diagLeft, diagRight; // Intialize indices for the diagonals 

  for( col=0; col < numCol; col++ ){
    
    // For first row (i.e. row=0)
    diagLeft = m[0][col];
    diagRight = m[0][col];

    for( row=1; row < numRow; row++ ){
      diagRight *= m[row][ ( ( ( col + row ) % numCol ) + numCol ) % numCol ];
      diagLeft *= m[row][ ( ( ( col - row ) % numCol ) + numCol ) % numCol ];
    }
    det += diagRight - diagLeft;


  }
  return det;
};


/**
 * Rotate a two dimensional vector by degree.
 *
 * @param {Array} point 
 * @param {Number} degree
 * @param {String} direction - clockwise or counterclockwise
 * @return {Array} vector
 */
matrix.rotate = function (point, degree, direction) {
  if (point.length === 2) {
    var negate = direction === "clockwise" ? -1 : 1;
    var radians = degree * (Math.PI / 180);

    var transformation = [
      [Math.cos(radians), -1*negate*Math.sin(radians)],
      [negate*Math.sin(radians), Math.cos(radians)]
    ];

    return matrix.multiply(transformation, point);
  } else {
    throw new Error("Only two dimensional operations are supported at this time");
  }
};

/**
 * Scale a two dimensional vector by scale factor x and scale factor y.
 *
 * @param {Array} point 
 * @param {Number} sx
 * @param {Number} sy
 * @return {Array} vector
 */
matrix.scale = function (point, sx, sy) {
  if (point.length === 2) {

    var transformation = [
      [sx, 0],
      [0, sy]
    ];

    return matrix.multiply(transformation, point);
  } else {
    throw new Error("Only two dimensional operations are supported at this time");
  }
};

/**
 * Shear a two dimensional vector by shear factor k.
 *
 * @param {Array} point 
 * @param {Number} k
 * @param {String} direction - xaxis or yaxis
 * @return {Array} vector
 */
matrix.shear = function (point, k, direction) {
  if (point.length === 2) {
    var xplaceholder = direction === "xaxis" ? k : 0;
    var yplaceholder = direction === "yaxis" ? k : 0;

    var transformation = [
      [1, xplaceholder],
      [yplaceholder, 1]
    ];

    return matrix.multiply(transformation, point);
  } else {
    throw new Error("Only two dimensional operations are supported at this time");
  }
};

/**
 * Perform an affine transformation on the given vector.
 *
 * @param {Array} point 
 * @param {Number} tx
 * @param {Number} ty
 * @return {Array} vector
 */
matrix.affine = function (point, tx, ty) {
  if (point.length === 2) {

    var transformation = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1 ]
    ];

    var newpoint = [
      [point[0][0]],
      [point[1][0]],
      [1]
    ];

    var transformed = matrix.multiply(transformation, newpoint);
    return [
      [transformed[0][0]],
      [transformed[1][0]],
    ];

  } else {
    throw new Error("Only two dimensional operations are supported at this time");
  }
};


/**
 * Scales a row of a matrix by a factor and returns the updated matrix. 
 * Used in row reduction functions.
 * 
 * @param {Array} matrix
 * @param {Number} row
 * @param {Number} scale
 */
matrix.rowScale = function ( m, row, scale ){
  var result = new Array(m.length);
    
  for (var i = 0; i < m.length; i++) {
    result[i] = new Array(m[i].length);
  
    for (var j = 0; j < m[i].length; j++) {
      if( i === row ){
        result[i][j] = scale * m[i][j]; 
      }
      else{
        result[i][j] = m[i][j];
      }
    }
  }
  return result;
}

/**
 * Swaps two rows of a matrix  and returns the updated matrix. 
 * Used in row reduction functions.
 * 
 * @param {Array} matrix
 * @param {Number} row1
 * @param {Number} row2
 */
matrix.rowSwitch = function( m, row1, row2 ){
  var result = new Array(m.length);
  
  for (var i = 0; i < m.length; i++) {
    result[i] = new Array(m[i].length);
  
    for (var j = 0; j < m[i].length; j++) {
      if( i === row1 ){
        result[i][j] = m[row2][j]; 
      }
      else if ( i === row2){
        result[i][j] = m[row1][j];
      }
      else{
        result[i][j] = m[i][j];
      }
    }
  }
  return result;
}

/**
 * Adds a multiple of one row to another row
 * in a matrix and returns the updated matrix. 
 * Used in row reduction functions.
 * 
 * @param {Array} matrix
 * @param {Number} row1
 * @param {Number} row2
 */
matrix.rowAddMultiple = function(m, from, to, scale){
  var result = new Array(m.length);
  
  for (var i = 0; i < m.length; i++) {
    result[i] = new Array(m[i].length);
  
    for (var j = 0; j < m[i].length; j++) {
      if( i === to ){
        result[to][j] = m[to][j] + scale * m[from][j];
      }
      else{
        result[i][j] = m[i][j];
      }
    }
  }
  return result;
}

/**
 * Returns a new matrix that is the sub matrix.
 */
matrix.subMatrix = function(m, startI, startJ, width, height) {
  var result = new Array(height);

  for (var i = 0; i < width; i++) {
    var t = new Array(width);
    for (var j = 0; j < height; j++) {
      t[j] = m[i+startI][j+startJ];
    }
    result[i] = t;
  }
  return result;
};

//temp
matrix.subtraction = function(m, n) {
  return matrix.addition(m, matrix.multiply(matrix.identity(n), n));
}

/**
 * Multiplies two nxn matrices. This function is meant 
 * to be useful for working with large matrices
 * http://en.wikipedia.org/wiki/Strassen_algorithm
 */
matrix.strassen = function(n, m) {
  if (!(n.length === m.length && n.length === n[0].length && 
      m.length === m[0].length)) {
    throw new Error('Cannot run Strassen algorithm on non nxn matrices');
  }
  // 1x1
  if (n.length === 1) {
    return [n[0][0]*m[0][0]];
  }
  if (n.length % 2 != 0) {
    throw new Error('Cannot run Strassen algorithm on non-even sized matrices');
  }
  // nxn n >= 2
  var mid = n.length/2,
      a = {},
      b = {};
  //create 4 sub matrices for each matrix (could do this in memory to improve performance)
  for (var i = 0; i <= 1; i++) {
    for (var j = 0; j <= 1; j++) {
      a[(i+1)+''+(j+1)] = matrix.subMatrix(n, i + (i)?mid:0, j + (j)?mid:0, mid, mid);
      b[(i+1)+''+(j+1)] = matrix.subMatrix(m, i + (i)?mid:0, j + (j)?mid:0, mid, mid);
    }
  }
  
  var p = new Array(7);

  //doing it this way until I can implement algorithm
  a['11+22'] = Matrix.addition(a['11'], a['22']),
  b['11+22'] = Matrix.addition(b['11'], b['22']),
  a['21+22'] = Matrix.addition(a['21'], a['22']),
  b['12-22'] = Matrix.subtraction(b['12'], b['22']),
  b['21-11'] = Matrix.subtraction(b['21'], b['11']),
  a['11+12'] = Matrix.addition(a['11'], a['12']),
  a['21-11'] = Matrix.subtraction(a['21'], a['11']),
  b['11+12'] = Matrix.addition(b['11'], b['12']),
  a['12-22'] = Matrix.subtraction(a['11'], a['22']),
  b['21+22'] = Matrix.addition(a['21'], a['22']);


  p[0] = Matrix.strassen(a['11+22'], b['11+22']);
  p[1] = Matrix.strassen(a['21+22'], b['11']);
  p[2] = Matrix.strassen(a['11'], b['12-22']);
  p[3] = Matrix.strassen(a['22'], b['21-11']);
  p[4] = Matrix.strassen(a['11+12'], b['22']);
  p[5] = Matrix.strassen(a['21-11'], b['11+22']);
  p[6] = Matrix.strassen(a['12-22'], b['21+22']);

  var c = {};

  c['12'] = Matrix.addition(p[2], p[4]);
  c['21'] = Matrix.addition(p[1], p[3]);
  c['11'] = Matrix.subtraction(Matrix.addition(p[0], p[3]), Matrix.addition(p[4], p[6]));
  c['22'] = Matrix.subtraction(Matrix.addition(p[0], p[2]), Matrix.addition(p[1], p[5]));

  var result = new Array(m.length);

  for (var i = 0; i < m.length; i++) result[i] = new Array(m.length);

  for (var i = 0; i < mid; i++) {
    for (var j = 0; j < mid; j++) {
      result[i][j] = c['11'][i][j];
      result[i][j + mid] = c['12'][i][j];
      result[i + mid][j] = c['21'][i][j];
      result[i + mid][j + mid] = c['22'][i][j];
    }
  } 

  return result;

};

