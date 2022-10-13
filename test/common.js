
function allclose(x1, x2, rtol=1e-9, atol=1e-9){
  
  for(let i = 0; i < x1.length; ++i){
    const err = Math.abs(+x1[i]  - +x2[i]);
    const ref = Math.abs(+x1[i]) + Math.abs(+x2[i])
    if(err < atol && err < rtol * ref){
      continue;
    }else{
      return false;
    }
  }
  return true;
}

function rand_array(n){
  return Array(n).fill().map(() => Math.random());
}
function cumsum(arr){
  let c = 0;
  return arr.map((v) => c += v)
}
module.exports = {rand_array, cumsum, allclose}