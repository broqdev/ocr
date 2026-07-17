import{_ as e,c as t,d as n,g as r,i,n as a,o,r as s,s as c,y as l}from"./pipeline.worker-CpZS0CNg.js";var u=class{type=`webgl`;maxArgs=8;gl;#e;#t;#n;#r;constructor(e){this.gl=e,this.#e=e.createFramebuffer(),this.#t=new Map,this.#n=new Map,this.#r=1}malloc(e,t){let n=this.gl,r=Math.ceil(e/4)||1,{width:i,height:a}=h(Math.ceil(r/4)||1),o=n.createTexture();if(!o)throw Error(`Failed to create texture`);n.bindTexture(n.TEXTURE_2D,o),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let s=i*a*4,c=null;t&&(c=new Float32Array(s),new Uint8Array(c.buffer).set(t)),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,i,a,0,n.RGBA,n.FLOAT,c),n.bindTexture(n.TEXTURE_2D,null);let l=this.#r++;return this.#t.set(l,{ref:1,size:e,texture:o,width:i,height:a}),l}incRef(e){let t=this.#t.get(e);if(!t)throw new o(e);t.ref++}decRef(e){let t=this.#t.get(e);if(!t)throw new o(e);t.ref--,t.ref===0&&(this.gl.deleteTexture(t.texture),this.#t.delete(e))}async read(e,t,n){let r=this.#t.get(e);if(!r)throw new o(e);let i=this.gl;t===void 0&&(t=0),n===void 0&&(n=r.size-t),i.bindFramebuffer(i.FRAMEBUFFER,this.#e),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,r.texture,0);let a=r.width*r.height*4*4,s=new Float32Array(a/4),c=i.createBuffer();if(!c)throw Error(`Failed to create PBO`);i.bindBuffer(i.PIXEL_PACK_BUFFER,c),i.bufferData(i.PIXEL_PACK_BUFFER,a,i.STREAM_READ),i.readPixels(0,0,r.width,r.height,i.RGBA,i.FLOAT,0);let l=i.getError();if(l!==i.NO_ERROR)throw i.deleteBuffer(c),Error(`WebGL error after readPixels: ${l}`);let u=i.fenceSync(i.SYNC_GPU_COMMANDS_COMPLETE,0);if(!u)throw Error(`Failed to create sync object`);i.flush(),i.bindBuffer(i.PIXEL_PACK_BUFFER,null),i.bindFramebuffer(i.FRAMEBUFFER,null),await new Promise((e,t)=>{let n=()=>{let r=i.clientWaitSync(u,0,0);if(r===i.TIMEOUT_EXPIRED){setTimeout(n,5);return}if(r===i.WAIT_FAILED){i.deleteSync(u),i.deleteBuffer(c),t(Error(`clientWaitSync failed`));return}e()};n()}),i.deleteSync(u),i.bindBuffer(i.PIXEL_PACK_BUFFER,c),i.getBufferSubData(i.PIXEL_PACK_BUFFER,0,s),i.bindBuffer(i.PIXEL_PACK_BUFFER,null),i.deleteBuffer(c);let d=new Uint8Array(s.buffer);return new Uint8Array(d.slice(t,t+n))}readSync(e,t,n){let r=this.#t.get(e);if(!r)throw new o(e);let i=this.gl;t===void 0&&(t=0),n===void 0&&(n=r.size-t),i.bindFramebuffer(i.FRAMEBUFFER,this.#e),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,r.texture,0);let a=r.width*r.height*4,s=new Float32Array(a);i.readPixels(0,0,r.width,r.height,i.RGBA,i.FLOAT,s),i.bindFramebuffer(i.FRAMEBUFFER,null);let c=new Uint8Array(s.buffer);return new Uint8Array(c.slice(t,t+n))}async prepareKernel(e){return this.prepareKernelSync(e)}prepareKernelSync(e){let t=d(e),n=this.#n.get(t.code);if(n)return new i(e,n);let r=m(this.gl,t);return this.#n.set(t.code,r),new i(e,r)}prepareRoutine(e){throw new t(e.name,`webgl`)}prepareRoutineSync(e){throw new t(e.name,`webgl`)}dispatch(e,t,n){let r=this.gl;if(r.isContextLost())throw Error(`WebGL context lost - cannot dispatch`);let{program:i,inputLocations:a}=e.data;if(t.length!==e.data.numInputs)throw Error(`Expected ${e.data.numInputs} inputs, got ${t.length}`);if(n.length!==1)throw Error(`Expected 1 output, got ${n.length}`);let s=this.#t.get(n[0]);if(!s)throw new o(n[0]);r.bindFramebuffer(r.FRAMEBUFFER,this.#e),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,s.texture,0);let c=r.checkFramebufferStatus(r.FRAMEBUFFER);if(c!==r.FRAMEBUFFER_COMPLETE)throw Error(`Framebuffer incomplete: ${c}`);r.viewport(0,0,s.width,s.height),r.useProgram(i);for(let e=0;e<t.length;e++){let n=this.#t.get(t[e]);if(!n)throw new o(t[e]);r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,n.texture),a[e]!==null&&r.uniform1i(a[e],e)}r.drawArrays(r.TRIANGLES,0,3);let l=r.getError();if(l!==r.NO_ERROR){let e;throw e=l===r.INVALID_ENUM?`INVALID_ENUM`:l===r.INVALID_VALUE?`INVALID_VALUE`:l===r.INVALID_OPERATION?`INVALID_OPERATION`:l===r.INVALID_FRAMEBUFFER_OPERATION?`INVALID_FRAMEBUFFER_OPERATION`:l===r.OUT_OF_MEMORY?`OUT_OF_MEMORY`:l===r.CONTEXT_LOST_WEBGL?`CONTEXT_LOST_WEBGL`:`UNKNOWN(${l})`,Error(`WebGL error after drawArrays: ${e}`)}r.bindFramebuffer(r.FRAMEBUFFER,null),r.useProgram(null)}};function d(t){let n=l(t);s>=3&&console.info(`webgl kernel.exp: ${t.exp}\ntune.exp: ${n.exp}`);let{nargs:i,reduction:a}=t,o=t.dtype,c=h(Math.ceil(t.size/4)||1),u=Array(i).fill(`float32`),d={erf:!1,threefry:!1},f=e=>{e.op===`GlobalIndex`?u[e.arg[0]]=e.dtype:e.op===`Erf`||e.op===`Erfc`?d.erf=!0:e.op===`Threefry2x32`&&(d.threefry=!0)};n.exp.fold(f),n.epilogue?.fold(f);let p=[],m=``,x=Symbol(`pushIndent`),S=Symbol(`popIndent`),C=(...e)=>{for(let t of e)t===x?m+=`  `:t===S?m=m.slice(0,-2):p.push(t&&m+t)};C(`#version 300 es`,`precision highp float;`,`precision highp int;`,``);let w=Array.from({length:i},(e,t)=>`in${t}`),T=g(o);for(let e=0;e<i;e++)C(`uniform highp sampler2D ${w[e]};`);C(`out vec4 out0;`);let E=new Set;for(let e of u)E.add(e);for(let e of E)C(_(e));if(d.erf&&C(`
const float _erf_p = 0.3275911;
const float _erf_a1 = 0.254829592;
const float _erf_a2 = -0.284496736;
const float _erf_a3 = 1.421413741;
const float _erf_a4 = -1.453152027;
const float _erf_a5 = 1.061405429;
float erf(float x) {
  float t = 1.0 / (1.0 + _erf_p * abs(x));
  float P_t = (((((_erf_a5 * t) + _erf_a4) * t + _erf_a3) * t + _erf_a2) * t + _erf_a1) * t;
  return sign(x) * (1.0 - P_t * exp(-x * x));
}
float erfc(float x) {
  float t = 1.0 / (1.0 + _erf_p * abs(x));
  float P_t = (((((_erf_a5 * t) + _erf_a4) * t + _erf_a3) * t + _erf_a2) * t + _erf_a1) * t;
  float E = P_t * exp(-x * x);
  return x >= 0.0 ? E : 2.0 - E;
}`),d.threefry&&C(`
uvec2 threefry2x32(uvec2 key, uvec2 ctr) {
  uint ks0 = key.x;
  uint ks1 = key.y;
  uint ks2 = ks0 ^ ks1 ^ 0x1BD11BDAu;

  uint x0 = ctr.x + ks0;
  uint x1 = ctr.y + ks1;

  x0 += x1; x1 = (x1 << 13u) | (x1 >> 19u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 15u) | (x1 >> 17u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 26u) | (x1 >> 6u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 6u) | (x1 >> 26u); x1 ^= x0;
  x0 += ks1;
  x1 += ks2 + 1u;

  x0 += x1; x1 = (x1 << 17u) | (x1 >> 15u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 29u) | (x1 >> 3u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 16u) | (x1 >> 16u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 24u) | (x1 >> 8u); x1 ^= x0;
  x0 += ks2;
  x1 += ks0 + 2u;

  x0 += x1; x1 = (x1 << 13u) | (x1 >> 19u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 15u) | (x1 >> 17u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 26u) | (x1 >> 6u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 6u) | (x1 >> 26u); x1 ^= x0;
  x0 += ks0;
  x1 += ks1 + 3u;

  x0 += x1; x1 = (x1 << 17u) | (x1 >> 15u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 29u) | (x1 >> 3u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 16u) | (x1 >> 16u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 24u) | (x1 >> 8u); x1 ^= x0;
  x0 += ks1;
  x1 += ks2 + 4u;

  x0 += x1; x1 = (x1 << 13u) | (x1 >> 19u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 15u) | (x1 >> 17u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 26u) | (x1 >> 6u); x1 ^= x0;
  x0 += x1; x1 = (x1 << 6u) | (x1 >> 26u); x1 ^= x0;
  x0 += ks2;
  x1 += ks0 + 5u;

  return uvec2(x0, x1);
}`),C(`${T} compute(int gidx) {`,x,`${T} result = ${y(o,0)};`,`if (gidx < ${t.size}) {`,x),!a)C(`result = ${e(b(n.exp,w,u))};`);else{C(`${g(a.dtype)} acc = ${y(a.dtype,a.identity)};`,`for (int ridx = 0; ridx < ${n.size.reduce}; ridx++) {`,x);let t=b(n.exp,w,u);if(a.op===`Add`)C(`acc += ${e(t)};`);else if(a.op===`Mul`)C(`acc *= ${e(t)};`);else if(a.op===`Min`)a.dtype===`bool`?C(`acc = acc && ${t};`):C(`acc = min(acc, ${e(t)});`);else if(a.op===`Max`)a.dtype===`bool`?C(`acc = acc || ${t};`):C(`acc = max(acc, ${e(t)});`);else throw Error(`Unsupported reduction op: ${a.op}`);C(S,`}`),C(`result = ${b(n.epilogue,w,u)};`)}return C(S,`}`,`return result;`,S,`}
`),C(`void main() {`,x,`ivec2 fragCoord = ivec2(gl_FragCoord.xy);`,`int texelIdx = fragCoord.y * ${c.width} + fragCoord.x;`,`${T} result0 = compute(texelIdx * 4);`,`${T} result1 = compute(texelIdx * 4 + 1);`,`${T} result2 = compute(texelIdx * 4 + 2);`,`${T} result3 = compute(texelIdx * 4 + 3);`,`out0 = vec4(${r(4).map(e=>v(o,`result${e}`)).join(`, `)});`),C(S,`}`),{code:p.join(`
`),numInputs:i,outputSize:[c.width,c.height],outputDtype:o}}function f(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)??`Unknown shader compile error`);return r}function p(e,t,n){let r=e.createProgram();if(e.attachShader(r,f(e,e.VERTEX_SHADER,t)),e.attachShader(r,f(e,e.FRAGMENT_SHADER,n)),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)??`Unknown program link error`);return r}function m(e,t){s>=1&&console.info(`=========== WebGL shader ===========
`+t.code);let n=p(e,`#version 300 es
precision highp float;
const vec2 pos[3] = vec2[](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
void main() { gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0); }
`,t.code),r=[];for(let i=0;i<t.numInputs;i++)r.push(e.getUniformLocation(n,`in${i}`));return{...t,program:n,inputLocations:r}}function h(e){let t=16384,n=Math.min(Math.ceil(Math.sqrt(e)),t);n=Math.min(1<<Math.ceil(Math.log2(n)),t);let r=Math.min(Math.ceil(e/n),t);return{width:n,height:r}}function g(e){switch(e){case`float32`:return`float`;case`int32`:return`int`;case`uint32`:return`uint`;case`bool`:return`bool`;default:throw Error(`Unsupported dtype for WebGL: ${e}`)}}function _(e){let t=`load_${e}`,r=g(e),i;if(n(e))i=`val`;else if(e===`int32`)i=`floatBitsToInt(val)`;else if(e===`uint32`)i=`floatBitsToUint(val)`;else if(e===`bool`)i=`floatBitsToInt(val) != 0`;else throw Error(`Unsupported dtype for WebGL fetch: ${e}`);return`
${r} ${t}(highp sampler2D tex, int idx) {
  ivec2 texSize = textureSize(tex, 0);
  int texel = idx / 4;
  int component = idx - texel * 4;
  ivec2 coord = ivec2(texel % texSize.x, texel / texSize.x);
  vec4 texVal = texelFetch(tex, coord, 0);
  float val;
  if (component == 0) val = texVal.x;
  else if (component == 1) val = texVal.y;
  else if (component == 2) val = texVal.z;
  else val = texVal.w;
  return ${i};
}
`}function v(e,t){switch(e){case`float32`:return t;case`int32`:return`intBitsToFloat(${t})`;case`uint32`:return`uintBitsToFloat(${t})`;case`bool`:return`intBitsToFloat(${t} ? 1 : 0)`;default:throw Error(`Unsupported dtype for WebGL output: ${e}`)}}function y(e,t){switch(e){case`bool`:return t?`true`:`false`;case`int32`:return t.toString();case`uint32`:return t.toString()+`u`;case`float32`:return Number.isNaN(t)?`uintBitsToFloat(0x7fc00000u)`:Number.isFinite(t)?`float(`+t.toString()+`)`:t>0?`uintBitsToFloat(0x7f800000u)`:`uintBitsToFloat(0xff800000u)`;default:throw Error(`Unsupported dtype for WebGL constant: ${e}`)}}function b(t,r,i){let o=new Map,s=t=>{if(o.has(t))return o.get(t);let{op:l,src:u,dtype:d,arg:f}=t,p=``;if(a.Binary.has(l)){let e=s(u[0]),t=s(u[1]);if(l===`Add`)p=d===`bool`?`(${e} || ${t})`:`(${e} + ${t})`;else if(l===`Sub`)p=`(${e} - ${t})`;else if(l===`Mul`)p=d===`bool`?`(${e} && ${t})`:`(${e} * ${t})`;else if(l===`Idiv`)p=n(d)?`trunc(${e} / ${t})`:`(${e} / ${t})`;else if(l===`Mod`)p=n(d)?`(${e} - ${t} * trunc(${e} / ${t}))`:`(${e} % ${t})`;else if(l===`Min`)p=d===`bool`?`(${e} && ${t})`:`min(${e}, ${t})`;else if(l===`Max`)p=d===`bool`?`(${e} || ${t})`:`max(${e}, ${t})`;else if(l===`BitCombine`){let n=f===`and`?`&`:f===`or`?`|`:`^`;d===`bool`&&(n+=n),p=`(${e} ${n} ${t})`}else l===`BitShift`&&(p=f===`shl`?`(${e} << ${t})`:`(${e} >> ${t})`)}else if(a.Compare.has(l)){let e=s(u[0]),t=s(u[1]);l===`Cmplt`?p=`(${e} < ${t})`:l===`Cmpne`&&(p=n(u[0].dtype)?`(${e} != ${t} || isnan(${e}) || isnan(${t}))`:`(${e} != ${t})`)}else if(a.Unary.has(l)){let t=s(u[0]);if(l===`Sin`)p=`sin(${e(t)})`;else if(l===`Cos`)p=`cos(${e(t)})`;else if(l===`Asin`)p=`asin(${e(t)})`;else if(l===`Atan`)p=`atan(${e(t)})`;else if(l===`Exp`)p=`exp(${e(t)})`;else if(l===`Log`)p=`log(${e(t)})`;else if(l===`Erf`)p=`erf(${e(t)})`;else if(l===`Erfc`)p=`erfc(${e(t)})`;else if(l===`Sqrt`)p=`sqrt(${e(t)})`;else if(l===`Floor`)p=`floor(${e(t)})`;else if(l===`Ceil`)p=`ceil(${e(t)})`;else if(l===`Reciprocal`)p=`(1.0 / ${t})`;else if(l===`Cast`)p=`${g(d)}(${e(t)})`;else if(l===`Bitcast`){let n=u[0].dtype;d===n?p=t:d===`float32`?n===`int32`?p=`intBitsToFloat(${e(t)})`:n===`uint32`&&(p=`uintBitsToFloat(${e(t)})`):d===`int32`?n===`float32`?p=`floatBitsToInt(${e(t)})`:n===`uint32`&&(p=`int(${e(t)})`):d===`uint32`&&(n===`float32`?p=`floatBitsToUint(${e(t)})`:n===`int32`&&(p=`uint(${e(t)})`))}}else if(l===`Threefry2x32`){let[t,n,r,i]=u.map(t=>e(s(t))),a=f,o=`threefry2x32(uvec2(${t}, ${n}), uvec2(${r}, ${i}))`;a===`xor`?p=`(${o}.x ^ ${o}.y)`:a===0?p=`${o}.x`:a===1&&(p=`${o}.y`)}else if(l===`Where`){let[e,t,n]=u.map(s);p=`(${e} ? ${t} : ${n})`}else if(l===`Const`)p=y(d,f);else if(l===`Special`)p=f[0];else if(l===`Variable`)p=f;else if(l===`GlobalIndex`){let t=f[0],n=s(u[0]);p=`load_${i[t]}(${r[t]}, ${e(n)})`}if(!p)throw new c(l,d,`webgl`,f);return o.set(t,p),p};return s(t)}export{u as WebGLBackend};