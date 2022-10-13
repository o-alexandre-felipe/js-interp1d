const fast = require('../fast-cubic-spline');
const standard = require('../cubic-spline');
const { rand_array, cumsum, allclose } = require('./common');

function rand_test(NPoints, NChecks){
  X = cumsum(rand_array(NPoints));
  Y = rand_array(NPoints)
  xn = 2*X[X.length-1] - X[X.length-2]; 
  c1 = new fast(X, Y);
  c2 = new standard(X, Y);
  if(!allclose(c1.ks, c2.ks)){
    throw new Error('Different curves')
  }
  for(const xi of X){
    const y1 = c1.at(xi)
    const y2 = c2.at(xi);
    if(Math.abs(y1 - y2) > 1e-9){
      throw new Error('Different interpolated values')
    }
  }
  for(xi = 0; xi < xn; xi += xn / (NChecks)){
    const y1 = c1.at(xi)
    const y2 = c2.at(xi);
    if(Math.abs(y1 - y2) > 1e-9){
      throw new Error('Different interpolated values')
    }
  }
}

function test_corner(m=1e-9, h=1){
  const X = [0, 1, 1 + m, 2];
  const Y = [0, h, 0, h];
  
  const c1 = new fast(X, Y);
  const c2 = new standard(X, Y);

  if(!allclose(c1.ks, c1.ks)){
    throw new Error('Different curves')
  }
  console.log(c1.ks, c2.ks)
}
function test_straight(NPoints, a, b){
  const X = cumsum(rand_array(NPoints));
  const Y = X.map(xi => a * xi + b);
  
  const c1 = new fast(X, Y);
  const c2 = new standard(X, Y);

  if(!allclose(c1.ks, c2.ks)){
    throw new Error('Different curves')
  }
}


(function main(){
  // Test accuracy of the random case
  rand_test(4, 100);
  rand_test(2, 100);
  rand_test(1000, 1000);
  
  test_corner(1e-9, 1)
  test_corner(1e-15, 1)
  test_corner(1e-15, 1e-15)

  for(let i = 0; i < 10; ++i){
    test_straight(10 + i, 1 - 2*Math.random(), 1 - 2*Math.random())
  }
})()

