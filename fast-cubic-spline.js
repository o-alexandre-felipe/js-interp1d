const {symtrisolve_inplace} = require('./tridiag')
module.exports = class Spline {
  constructor(xs, ys) {
    this.xs = xs;
    this.ys = ys;
    this.ks = this.getNaturalKs(new Float64Array(this.xs.length));
  }

  getNaturalKs(ks) {
    const n = this.xs.length - 1;
    const A_central = new Float64Array(n+1);
    const A_lower = new Float64Array(n+1);
    const b = ks;
    A_central[0] = 0;
    b[0] = 0;
    for (
      let i = 1;
      i <= n;
      i++ // rows
    ) {
      const dx2 =  1 / (this.xs[i] - this.xs[i-1]);
      A_lower[i-1] = dx2;
      A_central[i] = 2 * dx2;
      b[i] = 3 * (this.ys[i] - this.ys[i-1]) * (dx2 * dx2)
      A_central[i-1] += A_central[i];
      b[i-1] += b[i];
    }


    return symtrisolve_inplace(A_central, A_lower, b);

  }

  /**
   * Implementation based on binary-search-bounds lt
   */
  
  getIndexBefore(target) {
    const a = this.xs;
    let l = 0;
    let h = a.length - 1;
    let i = l - 1;
    while (l <= h) {
      let m = (l + h) >>> 1, x = a[m];
      if (x < target) { i = m; l = m + 1 } else { h = m - 1 }
    }
    return i;
  }

  at(x) {
    const i = this.getIndexBefore(x);
    const dx = this.xs[i+1] - this.xs[i];
    const dy = this.ys[i+1] - this.ys[i];
    const t = (x - this.xs[i]) / dx;
    const a = this.ks[i] * dx - dy;
    const b =-this.ks[i+1] * dx + dy;
    const q = this.ys[i] + t * dy + t * (1 - t) * (a + (b - a) * t);
    return q;
  }
};
