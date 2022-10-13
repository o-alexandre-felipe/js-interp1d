const BenchTable = require('benchtable');
const interp1 = require('interp1');
const CubicSpline = require('cubic-spline')
const FastCubicSpline = require('../fast-cubic-spline');
const PolyLinearScale = require('polylinear-scale');
const binarySearch = require('binary-search');
const binarySearchBounds = require('binary-search-bounds');
const { cumsum, rand_array } = require('./common');
function cubicSplineFunctor(cache){
  let cs = null;
  let prevX = {}, prevY = {};
  return (X, Y, x) => {
    if(!cs || !cache || (X !== prevX) || (Y !== prevY)) {
      cs = new CubicSpline(X, Y);
      prevX = X;
      prevY = Y;
    }
    return cs.at(x);
  }
}
function fastCubicSplineFunctor(cache){
  let cs = null;
  let prevX = {}, prevY = {};
  return (X, Y, x) => {
    if(!cs || !cache || (X !== prevX) || (Y !== prevY)) {
      cs = new FastCubicSpline(X, Y);
      prevX = X;
      prevY = Y;
    }
    return cs.at(x);
  }
}

function polyLinearScaleFunctor(cache, clamp=true){
  let pls = null;
  let prevX = {}, prevY = {};
  return (X, Y, y) => {
    if(!pls || !cache || (X !== prevX) || (Y !== prevY)) {
      pls = new PolyLinearScale(X, Y, clamp);
      prevX = X;
      prevY = Y;
    }
    return pls(x)
  }
}

function createInput(n){
  X = cumsum(rand_array(n));
  Y = rand_array(n);
  x = Math.random() * X[X.length-1]
  return [X, Y, x]
}


const suite = new BenchTable('interp', {isTransposed: false});

suite.addFunction('cubic-spline-construction', (X, Y) => new CubicSpline(X, Y))
suite.addFunction('fast cubic-spline-construction', (X, Y) => new FastCubicSpline(X, Y))
for(const method of ['linear', 'previous']){
  suite.addFunction('interp1 ' + method, (X, Y, x) => 
    interp1(X, Y, [x], method)
  )
}

suite.addFunction('fast-cubic-spline cache', fastCubicSplineFunctor(true))
suite.addFunction('fast-cubic-spline no cache', fastCubicSplineFunctor(false))

suite.addFunction('cubic-spline cache', cubicSplineFunctor(true))
suite.addFunction('cubic-spline no cache', cubicSplineFunctor(false))


suite.addFunction('polylinear-scale cache', polyLinearScaleFunctor(true))
suite.addFunction('polylinear-scale no cache', polyLinearScaleFunctor(false))

// suite.addFunction('binary-search', (X, Y, x) => binarySearch(X, x, (a,b) => a-b))
// suite.addFunction('binary-search-bounds', (X, Y, x) => binarySearchBounds.le(X, x, (a,b) => a-b))

for(let inputLength of [10, 1000]){
  suite.addInput(inputLength + ' samples', createInput(inputLength))
}
suite.on('cycle', e => {
  console.log(e.target.toString())
})
suite.on('error', e => {})
suite.on('complete', () => {
  console.log(suite.table.toString())
})
suite.run({async: false});