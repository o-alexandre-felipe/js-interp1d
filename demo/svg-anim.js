const Y = (n) => Array(n).fill().map(Math.random)
const X = (n) => Y(n).sort()
const CubicSpline = require('cubic-spline');
function interp1Linear(p){
  return 'M' + p.map((pi) => pi.x + ',' +pi.y).join(' L'); 
}
const N_DECIMAL_PLACES=0
function interp1Nearest(p){
  const path = [`M-1000,${p[0].y}`]
  const midpoint = p.slice(0,-1).map((_, i) => (0.5*((+p[i].x) + (+p[i+1].x))).toFixed(N_DECIMAL_PLACES))
  for(i = 0; i < p.length-1; ++i){
    path.push(` L${midpoint[i]},${p[i].y} M${midpoint[i]},${p[i+1].y}`)
  }
  path.push(` L1800,${p[p.length-1].y}`);
  return path.join('')
}
function interp1Previous(p){
  const path = p.slice(0,-1).map((_, i) => `M${p[i].x},${p[i].y} L${p[i+1].x},${p[i].y}`)
  plast = p[p.length-1]
  path.push(`M${plast.x},${plast.y} L1800,${plast.y}`);
  return path.join('')
}
function interp1Next(p){
  const path = p.slice(0,-1).map((_, i) => `M${p[i].x},${p[i+1].y} L${p[i+1].x},${p[i+1].y}`)
  plast = p[p.length-1]
  path.unshift(`M-1000,${p[0].y} L${p[0].x},${p[0].y}`);
  return path.join('')
}

function interp1Spline(p){
  const ns=(p.length-1)*30;
  const cy = new CubicSpline(p.map(pi => +pi.x), p.map(pi => +pi.y));
  const cx = new CubicSpline(p.map((_, i) => i), p.map(pi => +pi.x));
  const s = Array(ns+1).fill()
    .map((_, i) => cx.at(p.length*i/ns))
    .map(x => `L${x.toFixed(N_DECIMAL_PLACES)},${cy.at(x).toFixed(N_DECIMAL_PLACES)}`).join(' ')
  return 'M' + s.slice(1)
}

function randomPoints(n){
  const x = X(n).map((s,i) => (400*(i+1)/n+400*s).toFixed(N_DECIMAL_PLACES));
  const y = Y(n).map(s => (40+120*s).toFixed(N_DECIMAL_PLACES));
  return x.map((x, i) => ({x, y:y[i]}))
}

const fs = require('fs');
function generateSVG(f, NFrames = 6, NPoints = 10){
  const code = [];
  const p = Array(NFrames).fill().map(() => randomPoints(NPoints));
  const pathList = p.map(f);
  
  code.push(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewbox="0 0 40 10">
 <g>
 <rect fill="#abc" x="0" y="0" width="800" height="200" />
 <path id="interp1_path" style="fill:none; stroke: #000; stroke-linecap:round; stroke-linejoin: round; stroke-width: 4;"
   d="${pathList[NFrames-1]}"
 >`)
  for(let k = 0; k < NFrames; ++k){
    if(k == 0){
      
    }
    code.push(`  <animate attributeName="d" dur="200ms" begin="${
      k === 0 ? 't_' + (NFrames-1) + 'b.end; 0s': 't_' + (k-1) + 'b.end'
    }" id="t_${k}a" fill="freeze"
      to="${pathList[(k+1) % NFrames]}" />`
    );
    code.push(`  <animate dur="800ms" begin="t_${k}a.end" id="t_${k}b" />`);
  }
  code.push(' </path>')
  for(let i = 0; i < NPoints; ++i){
    code.push(` <circle fill="#456" r="10" cx="${p[0][i].x}" cy="${p[0][i].y}">`)
    for(let j = 0; j < NFrames; ++j){
      code.push(`  <animate attributeName="cx" dur="200ms" begin="t_${j}a.begin" to="${p[(j+1) % NFrames][i].x}" fill="freeze" />`);
      code.push(`  <animate attributeName="cy" dur="200ms" begin="t_${j}a.begin" to="${p[(j+1) % NFrames][i].y}" fill="freeze" />`);
    }
    code.push(' </circle>')
  }
  code.push('</g></svg>');
  fs.writeFileSync(__dirname + '/' + f.name + '.svg', code.join('\n'))
}

generateSVG(interp1Linear);
generateSVG(interp1Nearest);
generateSVG(interp1Previous);
generateSVG(interp1Next);
generateSVG(interp1Spline);