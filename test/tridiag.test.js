const { trisolve, trimul } = require("../tridiag");
const { rand_array, allclose } = require("./common");

function testTridiag(N){
  let a = rand_array(N);
  let b = rand_array(N-1)
  let c = rand_array(N-1)
  let d = rand_array(N);
  let x = trisolve(a,b,c,d);
  let y = trimul(a,b,c,x);
  console.log(allclose(y, d))
}
testTridiag(1);
testTridiag(2);
testTridiag(4);
testTridiag(10);