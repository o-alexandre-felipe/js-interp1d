/**
 * Solve a tridiagonal system where the elements
 *  b[i-1] * x[i-1] +  a[i] * x[i] + c[i] * x[i+1] = d[i]
 * 
 *  is the independent vector
 * 
 * @param {ArraLike<number>} a 
 * @param {ArraLike<number>} b 
 * @param {ArraLike<number>} c 
 * @param {ArraLike<number>} b 
 */
function trisolve(a, b, c, d){
  const N = a.length;
  const d_ = new Float64Array(d);
  const a_ = new Float64Array(a);
  for(let i = 0; i < N - 1; ++i){
    const f = b[i] / a_[i];
    d_[i+1] -= f * d_[i];
    a_[i+1] -= f * c[i];
  }
  for(let i = N-1; i; --i){
    d_[i-1] -= (c[i-1] / a_[i]) * d_[i];
    d_[i] /= a_[i]
  }
  d_[0] /= a_[0]
  return d_;
}

/**
 * Solve a symmetric tridiagonal system where the elements
 *  b[i-1] * x[i-1] +  a[i] * x[i] + b[i] * x[i+1] = d[i]
 * 
 *  is the independent vector
 * 
 * @param {ArraLike<number>} a 
 * @param {ArraLike<number>} b 
 * @param {ArraLike<number>} b 
 */
 function symtrisolve(a, b, d){
  const N = a.length;
  const d_ = new Float64Array(d);
  const a_ = new Float64Array(a);
  for(let i = 0; i < N - 1; ++i){
    const f = b[i] / a_[i];
    d_[i+1] -= f * d_[i];
    a_[i+1] -= f * b[i];
  }
  for(let i = N-1; i; --i){
    d_[i-1] -= (b[i-1] / a_[i]) * d_[i];
    d_[i] /= a_[i]
  }
  d_[0] /= a_[0]
  return d_;
}


/**
 * Solve a symmetric tridiagonal system where the elements
 * The arry a will be modified in the process and the array
 * d will be used to store the solution.
 *  b[i-1] * x[i-1] +  a[i] * x[i] + b[i] * x[i+1] = d[i]
 * 
 *  is the independent vector
 * 
 * @param {ArraLike<number>} a 
 * @param {ArraLike<number>} b 
 * @param {ArraLike<number>} b 
 */
 function symtrisolve_inplace(a, b, d){
  const N = a.length;
  for(let i = 0; i < N - 1; ++i){
    const f = b[i] / a[i];
    d[i+1] -= f * d[i];
    a[i+1] -= f * b[i];
  }
  for(let i = N-1; i; --i){
    const f = d[i] / a[i]
    d[i-1] -= b[i-1] * f;
    d[i] = f;
  }
  d[0] /= a[0]
  return d;
}


/**
 * Computes the vector
 *   y[i] = b[i-1] * x[i-1] +  a[i] * x[i] + c[i] * x[i+1] 
 * @param {ArrayLike<number>} a 
 * @param {ArrayLike<number>} b 
 * @param {ArrayLike<number>} c 
 * @param {ArrayLike<number>} x 
 */
function trimul(a,b,c,x){
  const N = a.length;
  let y = new Float64Array(N);
  for(let i = 0; i < N; ++i){
    y[i] = (b[i-1] || 0) * (x[i-1] || 0) 
         + (a[i  ] || 0) * (x[i  ] || 0) 
         + (c[i  ] || 0) * (x[i+1] || 0)
  }
  return y;
}

module.exports = {trisolve, symtrisolve, symtrisolve_inplace,trimul};
