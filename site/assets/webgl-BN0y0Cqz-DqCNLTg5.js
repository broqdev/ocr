import{_ as e,a as t,b as n,c as r,f as i,i as a,l as o,r as s,s as c,v as l}from"./jaxJsTable.worker-xonMtyyD.js";var u=class{type=`webgl`;maxArgs=8;gl;#e;#t;#n;#r;constructor(e){this.gl=e,this.#e=e.createFramebuffer(),this.#t=new Map,this.#n=new Map,this.#r=1}malloc(e,t){let n=this.gl,r=Math.ceil(e/4)||1,{width:i,height:a}=h(Math.ceil(r/4)||1),o=n.createTexture();if(!o)throw Error(`Failed to create texture`);n.bindTexture(n.TEXTURE_2D,o),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE);let s=i*a*4,c=null;t&&(c=new Float32Array(s),new Uint8Array(c.buffer).set(t)),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,i,a,0,n.RGBA,n.FLOAT,c),n.bindTexture(n.TEXTURE_2D,null);let l=this.#r++;return this.#t.set(l,{ref:1,size:e,texture:o,width:i,height:a}),l}incRef(e){let t=this.#t.get(e);if(!t)throw new c(e);t.ref++}decRef(e){let t=this.#t.get(e);if(!t)throw new c(e);t.ref--,t.ref===0&&(this.gl.deleteTexture(t.texture),this.#t.delete(e))}async read(e,t,n){let r=this.#t.get(e);if(!r)throw new c(e);let i=this.gl;t===void 0&&(t=0),n===void 0&&(n=r.size-t),i.bindFramebuffer(i.FRAMEBUFFER,this.#e),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,r.texture,0);let a=r.width*r.height*4*4,o=new Float32Array(a/4),s=i.createBuffer();if(!s)throw Error(`Failed to create PBO`);i.bindBuffer(i.PIXEL_PACK_BUFFER,s),i.bufferData(i.PIXEL_PACK_BUFFER,a,i.STREAM_READ),i.readPixels(0,0,r.width,r.height,i.RGBA,i.FLOAT,0);let l=i.getError();if(l!==i.NO_ERROR)throw i.deleteBuffer(s),Error(`WebGL error after readPixels: ${l}`);let u=i.fenceSync(i.SYNC_GPU_COMMANDS_COMPLETE,0);if(!u)throw Error(`Failed to create sync object`);i.flush(),i.bindBuffer(i.PIXEL_PACK_BUFFER,null),i.bindFramebuffer(i.FRAMEBUFFER,null),await new Promise((e,t)=>{let n=()=>{let r=i.clientWaitSync(u,0,0);if(r===i.TIMEOUT_EXPIRED){setTimeout(n,5);return}if(r===i.WAIT_FAILED){i.deleteSync(u),i.deleteBuffer(s),t(Error(`clientWaitSync failed`));return}e()};n()}),i.deleteSync(u),i.bindBuffer(i.PIXEL_PACK_BUFFER,s),i.getBufferSubData(i.PIXEL_PACK_BUFFER,0,o),i.bindBuffer(i.PIXEL_PACK_BUFFER,null),i.deleteBuffer(s);let d=new Uint8Array(o.buffer);return new Uint8Array(d.slice(t,t+n))}readSync(e,t,n){let r=this.#t.get(e);if(!r)throw new c(e);let i=this.gl;t===void 0&&(t=0),n===void 0&&(n=r.size-t),i.bindFramebuffer(i.FRAMEBUFFER,this.#e),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,r.texture,0);let a=r.width*r.height*4,o=new Float32Array(a);i.readPixels(0,0,r.width,r.height,i.RGBA,i.FLOAT,o),i.bindFramebuffer(i.FRAMEBUFFER,null);let s=new Uint8Array(o.buffer);return new Uint8Array(s.slice(t,t+n))}async prepareKernel(e){return this.prepareKernelSync(e)}prepareKernelSync(e){let n=d(e),r=this.#n.get(n.code);if(r)return new t(e,r);let i=m(this.gl,n);return this.#n.set(n.code,i),new t(e,i)}prepareRoutine(e){throw new o(e.name,`webgl`)}prepareRoutineSync(e){throw new o(e.name,`webgl`)}dispatch(e,t,n){let r=this.gl;if(r.isContextLost())throw Error(`WebGL context lost - cannot dispatch`);let{program:i,inputLocations:a}=e.data;if(t.length!==e.data.numInputs)throw Error(`Expected ${e.data.numInputs} inputs, got ${t.length}`);if(n.length!==1)throw Error(`Expected 1 output, got ${n.length}`);let o=this.#t.get(n[0]);if(!o)throw new c(n[0]);r.bindFramebuffer(r.FRAMEBUFFER,this.#e),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,o.texture,0);let s=r.checkFramebufferStatus(r.FRAMEBUFFER);if(s!==r.FRAMEBUFFER_COMPLETE)throw Error(`Framebuffer incomplete: ${s}`);r.viewport(0,0,o.width,o.height),r.useProgram(i);for(let e=0;e<t.length;e++){let n=this.#t.get(t[e]);if(!n)throw new c(t[e]);r.activeTexture(r.TEXTURE0+e),r.bindTexture(r.TEXTURE_2D,n.texture),a[e]!==null&&r.uniform1i(a[e],e)}r.drawArrays(r.TRIANGLES,0,3);let l=r.getError();if(l!==r.NO_ERROR){let e;throw e=l===r.INVALID_ENUM?`INVALID_ENUM`:l===r.INVALID_VALUE?`INVALID_VALUE`:l===r.INVALID_OPERATION?`INVALID_OPERATION`:l===r.INVALID_FRAMEBUFFER_OPERATION?`INVALID_FRAMEBUFFER_OPERATION`:l===r.OUT_OF_MEMORY?`OUT_OF_MEMORY`:l===r.CONTEXT_LOST_WEBGL?`CONTEXT_LOST_WEBGL`:`UNKNOWN(${l})`,Error(`WebGL error after drawArrays: ${e}`)}r.bindFramebuffer(r.FRAMEBUFFER,null),r.useProgram(null)}};function d(t){let r=n(t);a>=3&&console.info(`webgl kernel.exp: ${t.exp}\ntune.exp: ${r.exp}`);let{nargs:i,reduction:o}=t,s=t.dtype,c=h(Math.ceil(t.size/4)||1),u=Array(i).fill(`float32`),d={erf:!1,threefry:!1},f=e=>{e.op===`GlobalIndex`?u[e.arg[0]]=e.dtype:e.op===`Erf`||e.op===`Erfc`?d.erf=!0:e.op===`Threefry2x32`&&(d.threefry=!0)};r.exp.fold(f),r.epilogue?.fold(f);let p=[],m=``,x=Symbol(`pushIndent`),S=Symbol(`popIndent`),C=(...e)=>{for(let t of e)t===x?m+=`  `:t===S?m=m.slice(0,-2):p.push(t&&m+t)};C(`#version 300 es`,`precision highp float;`,`precision highp int;`,``);let w=Array.from({length:i},(e,t)=>`in${t}`),T=g(s);for(let e=0;e<i;e++)C(`uniform highp sampler2D ${w[e]};`);C(`out vec4 out0;`);let E=new Set;for(let e of u)E.add(e);for(let e of E)C(_(e));if(d.erf&&C(`
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
}`),C(`${T} compute(int gidx) {`,x,`${T} result = ${y(s,0)};`,`if (gidx < ${t.size}) {`,x),!o)C(`result = ${l(b(r.exp,w,u))};`);else{C(`${g(o.dtype)} acc = ${y(o.dtype,o.identity)};`,`for (int ridx = 0; ridx < ${r.size.reduce}; ridx++) {`,x);let e=b(r.exp,w,u);if(o.op===`Add`)C(`acc += ${l(e)};`);else if(o.op===`Mul`)C(`acc *= ${l(e)};`);else if(o.op===`Min`)o.dtype===`bool`?C(`acc = acc && ${e};`):C(`acc = min(acc, ${l(e)});`);else if(o.op===`Max`)o.dtype===`bool`?C(`acc = acc || ${e};`):C(`acc = max(acc, ${l(e)});`);else throw Error(`Unsupported reduction op: ${o.op}`);C(S,`}`),C(`result = ${b(r.epilogue,w,u)};`)}return C(S,`}`,`return result;`,S,`}
`),C(`void main() {`,x,`ivec2 fragCoord = ivec2(gl_FragCoord.xy);`,`int texelIdx = fragCoord.y * ${c.width} + fragCoord.x;`,`${T} result0 = compute(texelIdx * 4);`,`${T} result1 = compute(texelIdx * 4 + 1);`,`${T} result2 = compute(texelIdx * 4 + 2);`,`${T} result3 = compute(texelIdx * 4 + 3);`,`out0 = vec4(${e(4).map(e=>v(s,`result${e}`)).join(`, `)});`),C(S,`}`),{code:p.join(`
`),numInputs:i,outputSize:[c.width,c.height],outputDtype:s}}function f(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)??`Unknown shader compile error`);return r}function p(e,t,n){let r=e.createProgram();if(e.attachShader(r,f(e,e.VERTEX_SHADER,t)),e.attachShader(r,f(e,e.FRAGMENT_SHADER,n)),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)??`Unknown program link error`);return r}function m(e,t){a>=1&&console.info(`=========== WebGL shader ===========
`+t.code);let n=p(e,`#version 300 es
precision highp float;
const vec2 pos[3] = vec2[](vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
void main() { gl_Position = vec4(pos[gl_VertexID], 0.0, 1.0); }
`,t.code),r=[];for(let i=0;i<t.numInputs;i++)r.push(e.getUniformLocation(n,`in${i}`));return{...t,program:n,inputLocations:r}}function h(e){let t=16384,n=Math.min(Math.ceil(Math.sqrt(e)),t);n=Math.min(1<<Math.ceil(Math.log2(n)),t);let r=Math.min(Math.ceil(e/n),t);return{width:n,height:r}}function g(e){switch(e){case`float32`:return`float`;case`int32`:return`int`;case`uint32`:return`uint`;case`bool`:return`bool`;default:throw Error(`Unsupported dtype for WebGL: ${e}`)}}function _(e){let t=`load_${e}`,n=g(e),r;if(i(e))r=`val`;else if(e===`int32`)r=`floatBitsToInt(val)`;else if(e===`uint32`)r=`floatBitsToUint(val)`;else if(e===`bool`)r=`floatBitsToInt(val) != 0`;else throw Error(`Unsupported dtype for WebGL fetch: ${e}`);return`
${n} ${t}(highp sampler2D tex, int idx) {
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
  return ${r};
}
`}function v(e,t){switch(e){case`float32`:return t;case`int32`:return`intBitsToFloat(${t})`;case`uint32`:return`uintBitsToFloat(${t})`;case`bool`:return`intBitsToFloat(${t} ? 1 : 0)`;default:throw Error(`Unsupported dtype for WebGL output: ${e}`)}}function y(e,t){switch(e){case`bool`:return t?`true`:`false`;case`int32`:return t.toString();case`uint32`:return t.toString()+`u`;case`float32`:return Number.isNaN(t)?`uintBitsToFloat(0x7fc00000u)`:Number.isFinite(t)?`float(`+t.toString()+`)`:t>0?`uintBitsToFloat(0x7f800000u)`:`uintBitsToFloat(0xff800000u)`;default:throw Error(`Unsupported dtype for WebGL constant: ${e}`)}}function b(e,t,n){let a=new Map,o=e=>{if(a.has(e))return a.get(e);let{op:c,src:u,dtype:d,arg:f}=e,p=``;if(s.Binary.has(c)){let e=o(u[0]),t=o(u[1]);if(c===`Add`)p=d===`bool`?`(${e} || ${t})`:`(${e} + ${t})`;else if(c===`Sub`)p=`(${e} - ${t})`;else if(c===`Mul`)p=d===`bool`?`(${e} && ${t})`:`(${e} * ${t})`;else if(c===`Idiv`)p=i(d)?`trunc(${e} / ${t})`:`(${e} / ${t})`;else if(c===`Mod`)p=i(d)?`(${e} - ${t} * trunc(${e} / ${t}))`:`(${e} % ${t})`;else if(c===`Min`)p=d===`bool`?`(${e} && ${t})`:`min(${e}, ${t})`;else if(c===`Max`)p=d===`bool`?`(${e} || ${t})`:`max(${e}, ${t})`;else if(c===`BitCombine`){let n=f===`and`?`&`:f===`or`?`|`:`^`;d===`bool`&&(n+=n),p=`(${e} ${n} ${t})`}else c===`BitShift`&&(p=f===`shl`?`(${e} << ${t})`:`(${e} >> ${t})`)}else if(s.Compare.has(c)){let e=o(u[0]),t=o(u[1]);c===`Cmplt`?p=`(${e} < ${t})`:c===`Cmpne`&&(p=i(u[0].dtype)?`(${e} != ${t} || isnan(${e}) || isnan(${t}))`:`(${e} != ${t})`)}else if(s.Unary.has(c)){let e=o(u[0]);if(c===`Sin`)p=`sin(${l(e)})`;else if(c===`Cos`)p=`cos(${l(e)})`;else if(c===`Asin`)p=`asin(${l(e)})`;else if(c===`Atan`)p=`atan(${l(e)})`;else if(c===`Exp`)p=`exp(${l(e)})`;else if(c===`Log`)p=`log(${l(e)})`;else if(c===`Erf`)p=`erf(${l(e)})`;else if(c===`Erfc`)p=`erfc(${l(e)})`;else if(c===`Sqrt`)p=`sqrt(${l(e)})`;else if(c===`Floor`)p=`floor(${l(e)})`;else if(c===`Ceil`)p=`ceil(${l(e)})`;else if(c===`Reciprocal`)p=`(1.0 / ${e})`;else if(c===`Cast`)p=`${g(d)}(${l(e)})`;else if(c===`Bitcast`){let t=u[0].dtype;d===t?p=e:d===`float32`?t===`int32`?p=`intBitsToFloat(${l(e)})`:t===`uint32`&&(p=`uintBitsToFloat(${l(e)})`):d===`int32`?t===`float32`?p=`floatBitsToInt(${l(e)})`:t===`uint32`&&(p=`int(${l(e)})`):d===`uint32`&&(t===`float32`?p=`floatBitsToUint(${l(e)})`:t===`int32`&&(p=`uint(${l(e)})`))}}else if(c===`Threefry2x32`){let[e,t,n,r]=u.map(e=>l(o(e))),i=f,a=`threefry2x32(uvec2(${e}, ${t}), uvec2(${n}, ${r}))`;i===`xor`?p=`(${a}.x ^ ${a}.y)`:i===0?p=`${a}.x`:i===1&&(p=`${a}.y`)}else if(c===`Where`){let[e,t,n]=u.map(o);p=`(${e} ? ${t} : ${n})`}else if(c===`Const`)p=y(d,f);else if(c===`Special`)p=f[0];else if(c===`Variable`)p=f;else if(c===`GlobalIndex`){let e=f[0],r=o(u[0]);p=`load_${n[e]}(${t[e]}, ${l(r)})`}if(!p)throw new r(c,d,`webgl`,f);return a.set(e,p),p};return o(e)}export{u as WebGLBackend};