import{_ as e,a as t,b as n,c as r,d as i,f as a,g as o,h as s,i as c,l,m as u,n as d,o as f,p,r as m,s as h,t as g,u as _,v}from"./pipeline.worker-DUhuCHgD.js";const y=String.raw`
fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn inf() -> f32 { let bits = 0x7f800000u; return bitcast<f32>(bits); }
`.trim();var b=class{pushIndent=Symbol(`pushIndent`);popIndent=Symbol(`popIndent`);lines=[];#e=``;emit(...e){for(let t of e)t===this.pushIndent?this.#e+=`  `:t===this.popIndent?this.#e=this.#e.slice(0,-2):this.lines.push(t?this.#e+t:``)}emitPreamble(e,t){let n=!1,r=new Map;for(let e of t)e!=null&&(n||=e.some(e=>e.dtype===`float16`),r=p(r,e.distinctOps()));if(n){if(!e.features.has(`shader-f16`))throw Error(`WebGPU device does not support shader-f16 feature`);this.emit(`enable f16;`)}this.emit(y),r.has(`Threefry2x32`)&&this.emit(`
fn threefry2x32(key: vec2<u32>, ctr: vec2<u32>) -> vec2<u32> {
  let ks0: u32 = key.x;
  let ks1: u32 = key.y;
  let ks2: u32 = ks0 ^ ks1 ^ 0x1BD11BDAu;

  var x0: u32 = ctr.x + ks0;
  var x1: u32 = ctr.y + ks1;

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

  return vec2<u32>(x0, x1);
}`),(r.has(`Erf`)||r.has(`Erfc`))&&this.emit(`
const _erf_p: f32 = 0.3275911;
const _erf_a1: f32 = 0.254829592;
const _erf_a2: f32 = -0.284496736;
const _erf_a3: f32 = 1.421413741;
const _erf_a4: f32 = -1.453152027;
const _erf_a5: f32 = 1.061405429;
fn erf(x: f32) -> f32 {
  let t = 1.0 / (1.0 + _erf_p * abs(x));
  let P_t = fma(fma(fma(fma(_erf_a5, t, _erf_a4), t, _erf_a3), t, _erf_a2), t, _erf_a1) * t;
  return sign(x) * (1.0 - P_t * exp(-x * x));
}
fn erfc(x: f32) -> f32 {
  let t = 1.0 / (1.0 + _erf_p * abs(x));
  let P_t = fma(fma(fma(fma(_erf_a5, t, _erf_a4), t, _erf_a3), t, _erf_a2), t, _erf_a1) * t;
  let E = P_t * exp(-x * x);
  return select(2.0 - E, E, x >= 0.0);
}`),this.emit(``)}emitPhonyAssignments(e){e.length>0&&this.emit(e.map(e=>`_ = &${e};`).join(` `))}toString(){return this.lines.join(`
`)}};function x(e,t=!1){switch(e){case`bool`:return t?`i32`:`bool`;case`int32`:return`i32`;case`uint32`:return`u32`;case`float32`:return`f32`;case`float16`:return`f16`;default:throw Error(`Unsupported dtype for WebGPU: ${e}`)}}function S(e){switch(e){case`bool`:return`1`;case`int32`:return`2147483647`;case`uint32`:return`4294967295u`;case`float32`:return`inf()`;case`float16`:return`f16(inf())`;default:throw Error(`Unsupported dtype for WebGPU: ${e}`)}}function C(e,t){if(e===`bool`)return t?`true`:`false`;if(e===`int32`)return t.toString();if(e===`uint32`)return t.toString()+`u`;if(e===`float32`)return Number.isNaN(t)?`nan()`:Number.isFinite(t)?`f32(`+t.toString()+`)`:t>0?`inf()`:`-inf()`;if(e===`float16`)return Number.isNaN(t)?`f16(nan())`:Number.isFinite(t)?`f16(`+t.toString()+`)`:t>0?`f16(inf())`:`f16(-inf())`;throw Error(`Unsupported const dtype: ${e}`)}function ee(e,t,n,r){if(e===`Add`)return`(${n} + ${r})`;if(e===`Mul`)return`(${n} * ${r})`;if(e===`Min`)return t===`bool`?`(${n} && ${r})`:`min(${n}, ${r})`;if(e===`Max`)return t===`bool`?`(${n} || ${r})`:`max(${n}, ${r})`;throw Error(`Unsupported reduction op: ${e}`)}var w=class{wb;args;#e=0;#t=new Map;#n=new Set;#r=new Map;constructor(e,t){this.wb=e,this.args=t}#i(){return`alu${this.#e++}`}#a(e){return e.match(/^alu[0-9]+$/)}countReferences(e){if(this.#t.set(e,(this.#t.get(e)??0)+1),!this.#n.has(e)){this.#n.add(e);for(let t of e.src)this.countReferences(t)}}reset(){this.#t.clear(),this.#n.clear(),this.#r.clear()}run(t){if(this.#r.has(t))return this.#r.get(t);let{op:n,src:r,dtype:a,arg:o}=t,s=``;if(d.Binary.has(n)||d.Compare.has(n)){let t=this.run(r[0]),c=this.run(r[1]);if(n===`Add`)s=a===`bool`?`(${t} || ${c})`:`(${t} + ${c})`;else if(n===`Sub`)s=`(${t} - ${c})`;else if(n===`Mul`)s=a===`bool`?`(${t} && ${c})`:`(${t} * ${c})`;else if(n===`Idiv`)s=i(a)?`trunc(${t} / ${c})`:`(${t} / ${c})`;else if(n===`Mod`)s=`(${t} % ${c})`;else if(n===`Min`)s=a===`bool`?`(${t} && ${c})`:`min(${e(t)}, ${e(c)})`;else if(n===`Max`)s=a===`bool`?`(${t} || ${c})`:`max(${e(t)}, ${e(c)})`;else if(n===`BitCombine`)s=o===`and`?`(${t} & ${c})`:o===`or`?`(${t} | ${c})`:a===`bool`?`(${t} != ${c})`:`(${t} ^ ${c})`;else if(n===`BitShift`)s=o===`shl`?`(${t} << ${c})`:`(${t} >> ${c})`;else if(n===`Cmplt`)s=`(${t} < ${c})`;else if(n===`Cmpne`)if(i(r[0].dtype)){let e=this.#a(t)?t:this.#i();e!==t&&this.wb.emit(`let ${e} = ${t};`),s=`(${e} != ${c} || min(${e}, ${x(r[0].dtype)}(inf())) != ${e})`}else s=`(${t} != ${c})`}else if(d.Unary.has(n))if(n===`Reciprocal`&&r[0].op===`Sqrt`)s=`inverseSqrt(${this.run(r[0].src[0])})`;else{let t=this.run(r[0]);if(n===`Sin`)s=`sin(${e(t)})`;else if(n===`Cos`)s=`cos(${e(t)})`;else if(n===`Asin`)s=`asin(${e(t)})`;else if(n===`Atan`)s=`atan(${e(t)})`;else if(n===`Exp`)s=`exp(${e(t)})`;else if(n===`Log`)s=`log(${e(t)})`;else if(n===`Erf`||n===`Erfc`){let r=n===`Erf`?`erf`:`erfc`;s=a===`float32`?`${r}(${e(t)})`:`${x(a)}(${r}(f32(${e(t)})))`}else if(n===`Sqrt`)s=`sqrt(${e(t)})`;else if(n===`Reciprocal`)s=`(1.0 / ${t})`;else if(n===`Floor`)s=`floor(${e(t)})`;else if(n===`Ceil`)s=`ceil(${e(t)})`;else if(n===`Cast`){let n=x(r[0].dtype),o=x(a);if(i(r[0].dtype)&&!(i(a)||a===`bool`)){let r=S(a),i=this.#a(t)?t:this.#i();i!==t&&this.wb.emit(`let ${i}: ${n} = ${e(t)};`),s=`select(${o}(${i}), ${r}, ${i} >= ${n}(${r}))`}else s=`${o}(${e(t)})`}else n===`Bitcast`&&(s=`bitcast<${x(a)}>(${e(t)})`)}else if(n===`Where`)s=`select(${e(this.run(r[2]))}, ${e(this.run(r[1]))}, ${e(this.run(r[0]))})`;else if(n===`Threefry2x32`){let t=this.#i(),[i,c,l,u]=r.map(t=>e(this.run(t)));if(this.wb.emit(`let ${t} = threefry2x32(vec2(${i}, ${c}), vec2(${l}, ${u}));`),o===`xor`)s=`(${t}.x ^ ${t}.y)`;else if(o===0)s=`${t}.x`;else if(o===1)s=`${t}.y`;else throw new h(n,a,`webgpu`,o)}else if(n===`Const`)return C(a,o);else if(n===`Special`)return o[0];else if(n===`Variable`)return o;else n===`GlobalIndex`&&(s=`${this.args[o[0]]}[${e(this.run(r[0]))}]`,a===`bool`&&(s=`(${s} != 0)`));if(!s)throw new h(n,a,`webgpu`,o);let c=x(a);if((this.#t.get(t)??0)>1){let n=this.#i();return this.#r.set(t,n),this.wb.emit(`let ${n}: ${c} = ${e(s)};`),n}else return this.#r.set(t,s),s}};const T=16384;function E(e){let t=e,n=1;return e>65535&&(t=T,n=Math.ceil(e/T)),[t,n]}function D(e){return e===`float16`?`float32`:e===`bool`?`int32`:e}function O({name:e,dtype:t,uniformDtype:n}){let r=g.variable(n,`uniforms.${e}`);return t===`float16`?g.cast(`float16`,r):t===`bool`?g.cmpne(r,g.i32(0)):r}function k(e,t,n,r){switch(n){case`float32`:e.setFloat32(t,r,!0);break;case`int32`:e.setInt32(t,r,!0);break;case`uint32`:e.setUint32(t,r,!0);break;default:throw Error(`Unsupported dtype for constant uniform: ${n}`)}}function A(e){let t=[];return[e.rewrite(e=>{if(e.op!==`Const`||e.arg===0)return;let n={name:`c${t.length}`,dtype:e.dtype,uniformDtype:D(e.dtype),value:e.arg};return t.push(n),O(n)}),t]}function j(e){let t=new Uint8Array(e.length*4),n=new DataView(t.buffer);return e.forEach((e,t)=>k(n,t*4,e.uniformDtype,e.value)),t}function M(t,n){if(n.nargs!==0||n.reduction)return null;let r=n.exp.substitute({gidx:g.special(`int32`,`gidx`,n.size)}).simplify(),i=[];[r,i]=A(r);let a=new b;a.emitPreamble(t,[r]),i.length>0&&a.emit(`struct Uniforms {`,a.pushIndent,...i.map(e=>`${e.name}: ${x(e.uniformDtype)},`),a.popIndent,`}
`);let o=x(n.dtype,!0);a.emit(`@group(0) @binding(0) var<storage, read_write> result : array<${o}>;`),i.length>0&&a.emit(`@group(1) @binding(0) var<uniform> uniforms: Uniforms;`);let s=_(n.size,256),[c,l]=E(Math.ceil(n.size/s));if(a.emit(``,`@compute @workgroup_size(${s})`,`fn main(@builtin(global_invocation_id) id : vec3<u32>) {`,a.pushIndent),l===1)a.emit(`if (id.x >= ${n.size}) { return; }`,`let gidx: i32 = i32(id.x);`);else{let e=c*s;a.emit(`if (${e} * id.y + id.x >= ${n.size}) { return; }`,`let gidx: i32 = i32(${e} * id.y + id.x);`)}let u=new w(a,[]);u.countReferences(r);let d=e(u.run(r));return o!==x(r.dtype)&&(d=`${o}(${d})`),a.emit(`result[gidx] = ${d};`,a.popIndent,`}`),{code:a.toString(),numInputs:0,numOutputs:1,hasUniform:i.length>0,passes:[{grid:[c,l],uniform:i.length>0?j(i):void 0}]}}var N=class e{device;static alphaModes=[`opaque`,`premultiplied`];static width=256;static height=256;initialized=!1;deviceStorage;deviceContexts;hostStorage;hostContext;constructor(e){this.device=e}#e(){if(typeof OffscreenCanvas>`u`)throw Error(`OffscreenCanvas is not available in this environment, so you cannot read data from WebGPU synchronously. Consider using the async API.`);let t=()=>new OffscreenCanvas(e.width,e.height);this.deviceStorage=e.alphaModes.map(t),this.deviceContexts=this.deviceStorage.map((t,n)=>{let r=t.getContext(`webgpu`);return r.configure({device:this.device,format:`bgra8unorm`,usage:GPUTextureUsage.COPY_DST,alphaMode:e.alphaModes[n]}),r}),this.hostStorage=t(),this.hostContext=this.hostStorage.getContext(`2d`,{willReadFrequently:!0}),this.initialized=!0}read(t,n,r){this.initialized||this.#e();let i=this.deviceStorage,a=this.deviceContexts,o=this.hostContext,s=Math.ceil(r/4),c=e.width*4,l=new ArrayBuffer(s*4);for(let r=0;r<a.length;r++){let u=a[r].getCurrentTexture(),d=(a,s,d)=>{let f=this.device.createCommandEncoder();f.copyBufferToTexture({buffer:t,bytesPerRow:c,offset:d+n},{texture:u},{width:a,height:s,depthOrArrayLayers:1});let p=f.finish();this.device.queue.submit([p]),o.clearRect(0,0,a,s),o.drawImage(i[r],0,0);let m=o.getImageData(0,0,a,s).data,h=new Uint8ClampedArray(l,d,4*a*s),g=e.alphaModes[r];for(let e=0;e<h.length;e+=4)g===`premultiplied`?h[e+3]=m[e+3]:(h[e]=m[e+2],h[e+1]=m[e+1],h[e+2]=m[e])},f=e.width*e.height,p=Math.floor(s/f),m=s%f,h=Math.floor(m/e.width);m%=e.width;let g=0;for(let t=0;t<p;t++)d(e.width,e.height,g),g+=f*4;h>0&&(d(e.width,h,g),g+=h*e.width*4),m>0&&d(m,1,g)}return new Uint8Array(l,0,r)}};function te(e){let t=new Uint32Array(3);return t[0]=e.kind===`sort`?0:1,t[1]=e.mergeStep??0,t[2]=e.mergeStage??0,new Uint8Array(t.buffer)}function P(e,t,n,r,a){let o=x(t,!0),s=1<<Math.ceil(Math.log2(n||1)),c=Math.ceil(s/2),l=_(c,e.limits.maxComputeWorkgroupSizeX),u=c/l,d=Math.log2(s),f=Math.min(d,Math.log2(l*2)),p=t===`float16`,m=i(t)?`${o}(nan())`:S(t),h=`
${p?`enable f16;`:``}
${y}

struct Uniforms {
  kind: u32, // 0 = sort, 1 = merge
  merge_step: u32, // half_block = 2^step
  merge_stage: u32, // only used for merge
}

@group(0) @binding(0) var<storage, read> input: array<${o}>;
@group(0) @binding(1) var<storage, read_write> output: array<${o}>;
${a?`@group(0) @binding(2) var<storage, read_write> output_idx: array<i32>;`:``}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

var<workgroup> shared_vals: array<${o}, ${l*2}>;
${a?`var<workgroup> shared_idx: array<i32, ${l*2}>;`:``}

fn compare(a: ${o}, b: ${o}) -> bool {
${i(t)?`
  let min_value = min(a, b);
  return a == min_value && b != min_value;`:`  return a < b;`}
}

fn compare_and_swap(i: u32, j: u32) {
  let val_i = shared_vals[i];
  let val_j = shared_vals[j];
${a?`
  if (
    compare(val_j, val_i) ||
    (!compare(val_i, val_j) && shared_idx[j] < shared_idx[i])
  ) {
    shared_vals[i] = val_j;
    shared_vals[j] = val_i;
    let tmp_idx = shared_idx[i];
    shared_idx[i] = shared_idx[j];
    shared_idx[j] = tmp_idx;
  }`:`
  if (compare(val_j, val_i)) {
    shared_vals[i] = val_j;
    shared_vals[j] = val_i;
  }`}
}

@compute @workgroup_size(${l})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let blockid = wg_id.x + wg_id.y * ${T}u;
  let batch = blockid / ${u}u;
  let wg_in_batch = blockid % ${u}u;

  let tid = local_id.x;
  let base = batch * ${n}u;

  if (uniforms.kind == 0u || (uniforms.kind == 1u && uniforms.merge_step == ${f-1}u)) {
    let wg_base = wg_in_batch * ${l*2}u;

    // Load data into shared memory (2 elements per thread)
    let idx0 = tid * 2u;
    let idx1 = tid * 2u + 1u;
    // Load from input for initial 'sort' pass, then from output (read-write) for 'merge' passes.
    if (uniforms.kind == 0u) {
      shared_vals[idx0] = select(${m}, input[base + wg_base + idx0], wg_base + idx0 < ${n}u);
      shared_vals[idx1] = select(${m}, input[base + wg_base + idx1], wg_base + idx1 < ${n}u);
${a?`
      shared_idx[idx0] = i32(wg_base + idx0);
      shared_idx[idx1] = i32(wg_base + idx1);`:``}
    } else {
      shared_vals[idx0] = select(${m}, output[base + wg_base + idx0], wg_base + idx0 < ${n}u);
      shared_vals[idx1] = select(${m}, output[base + wg_base + idx1], wg_base + idx1 < ${n}u);
${a?`
      shared_idx[idx0] = select(${n}, output_idx[base + wg_base + idx0], wg_base + idx0 < ${n}u);
      shared_idx[idx1] = select(${n}, output_idx[base + wg_base + idx1], wg_base + idx1 < ${n}u);`:``}
    }
    workgroupBarrier();

    let initial_stage = select(0u, ${f-1}u, uniforms.kind != 0u);
    for (var stage = initial_stage; stage < ${f}u; stage++) {
      for (var step1 = stage + 1u; step1 > 0u; step1--) {
        let step = step1 - 1u;
        let half_block = 1u << step;
        let is_first_step = uniforms.kind == 0u && step == stage;

        let block_offset = (tid / half_block) * half_block;
        let local_offset = tid % half_block;
        let i = block_offset * 2u + local_offset;
        let j = select(i + half_block, i ^ (half_block * 2u - 1u), is_first_step);
        compare_and_swap(i, j);

        workgroupBarrier();
      }
    }

    if (wg_base + idx0 < ${n}u) {
      output[base + wg_base + idx0] = shared_vals[idx0];
      ${a?`output_idx[base + wg_base + idx0] = shared_idx[idx0];`:``}
    }
    if (wg_base + idx1 < ${n}u) {
      output[base + wg_base + idx1] = shared_vals[idx1];
      ${a?`output_idx[base + wg_base + idx1] = shared_idx[idx1];`:``}
    }
  } else {
    // Execute single merge pass for a step >= numLocalStages.
    let half_block = 1u << uniforms.merge_step;  // half_block >= workgroupSize * 2
    let thread_in_batch = wg_in_batch * ${l} + tid;
    let is_first_step = uniforms.merge_step == uniforms.merge_stage;

    let block_offset = (thread_in_batch / half_block) * half_block;
    let local_offset = thread_in_batch % half_block;
    let i = block_offset * 2u + local_offset;
    let j = select(i + half_block, i ^ (half_block * 2u - 1u), is_first_step);

    // Global version of compare_and_swap()
    if (j < ${n}u) {
      let val_i = output[base + i];
      let val_j = output[base + j];
${a?`
      let idx_i = output_idx[base + i];
      let idx_j = output_idx[base + j];
      if (compare(val_j, val_i) || (!compare(val_i, val_j) && idx_j < idx_i)) {
        output[base + i] = val_j;
        output[base + j] = val_i;
        output_idx[base + i] = idx_j;
        output_idx[base + j] = idx_i;`:`
      if (compare(val_j, val_i)) {
        output[base + i] = val_j;
        output[base + j] = val_i;`}
      }
    }
  }
}
`.trim(),g=E(r*u),v=[{kind:`sort`}];for(let e=f;e<d;e++)for(let t=e;t>=f-1;t--)v.push({kind:`merge`,mergeStep:t,mergeStage:e});return[{code:h,numInputs:1,numOutputs:a?2:1,hasUniform:!0,passes:v.map(e=>({grid:g,uniform:te(e)}))}]}function F(e,t){let n=t.inputDtypes[0],r=t.inputShapes[0],i=r[r.length-1];return P(e,n,i,s(r.slice(0,-1)),!1)}function I(e,t){let n=t.inputDtypes[0],r=t.inputShapes[0],i=r[r.length-1];return P(e,n,i,s(r.slice(0,-1)),!0)}function L(e,t,n){let r=t.inputDtypes[0],i=t.inputShapes[0],a=t.inputShapes[1],o=i[i.length-1],c=a[a.length-2],l=s(i.slice(0,-2)),u=r===`float16`,d=x(r,!0),f=_(o,e.limits.maxComputeWorkgroupSizeX);return[{code:`
${u?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> a: array<${d}>;
@group(0) @binding(1) var<storage, read> b: array<${d}>;
@group(0) @binding(2) var<storage, read_write> x: array<${d}>;

// Shared memory for the current pivot value x[j]
var<workgroup> x_j: ${d};

@compute @workgroup_size(${f})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let wg_idx = wg_id.x + wg_id.y * ${T}u;
  let mat_idx = wg_idx / ${c}u;
  let rhs_idx = wg_idx % ${c}u;

  if (mat_idx >= ${l}u) {
    return;
  }

  let a_base = mat_idx * ${o*o}u;
  let bx_base = (mat_idx * ${c}u + rhs_idx) * ${o}u;
  let tid = local_id.x;

  // Step 1: Copy b to x (threads collaborate)
  for (var idx = tid; idx < ${o}u; idx += ${f}u) {
    x[bx_base + idx] = b[bx_base + idx];
  }
  storageBarrier();

  // Step 2: Back-substitution from j = n-1 down to 0
  for (var jj = 0u; jj < ${o}u; jj++) {
    let j = ${o-1}u - jj;

    // Thread 0 computes x[j] = x[j] / a[j,j]
    if (tid == 0u) {
      ${n.unitDiagonal?`x_j = x[bx_base + j];`:`x_j = x[bx_base + j] / a[a_base + j * ${o}u + j];`}
      x[bx_base + j] = x_j;
    }
    workgroupBarrier();  // Sync shared memory x_j

    // All threads subtract x[j] * a[i,j] from x[i] for i < j
    for (var i = tid; i < j; i += ${f}u) {
      x[bx_base + i] -= x_j * a[a_base + i * ${o}u + j];
    }
    workgroupBarrier();
    storageBarrier();
  }
}
`.trim(),numInputs:2,numOutputs:1,hasUniform:!1,passes:[{grid:E(l*c)}]}]}function R(e,t){let n=t.inputDtypes[0],r=t.inputShapes[0],i=r[r.length-1],a=s(r.slice(0,-2)),o=n===`float16`,c=x(n,!0),l=_(i,e.limits.maxComputeWorkgroupSizeX);return[{code:`
${o?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input: array<${c}>;
@group(0) @binding(1) var<storage, read_write> output: array<${c}>;

// Shared memory for the diagonal element
var<workgroup> L_jj: ${c};

@compute @workgroup_size(${l})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let batch = wg_id.x + wg_id.y * ${T}u;
  if (batch >= ${a}u) {
    return;
  }

  let base = batch * ${i*i}u;
  let tid = local_id.x;

  // Zero out output and copy lower triangle from input (threads collaborate)
  for (var idx = tid; idx < ${i*i}u; idx += ${l}u) {
    let row = idx / ${i}u;
    let col = idx % ${i}u;
    output[base + idx] = select(0, input[base + idx], col <= row);
  }
  storageBarrier();

  // Cholesky-Crout algorithm: process column by column
  for (var j = 0u; j < ${i}u; j++) {
    // Step 1: All threads compute sum for their rows i >= j in parallel
    // sum = A[i][j] - sum(L[i][k] * L[j][k] for k < j)
    for (var i = j + tid; i < ${i}u; i += ${l}u) {
      var sum = output[base + i * ${i}u + j];
      for (var k = 0u; k < j; k++) {
        sum -= output[base + i * ${i}u + k] * output[base + j * ${i}u + k];
      }
      output[base + i * ${i}u + j] = sum;
    }
    storageBarrier();

    // Step 2: Thread 0 computes L[j][j] = sqrt(output[j][j])
    if (tid == 0u) {
      L_jj = sqrt(output[base + j * ${i}u + j]);
      output[base + j * ${i}u + j] = L_jj;
    }
    workgroupBarrier();

    // Step 3: All threads divide output[i][j] by L[j][j] for i > j
    for (var i = j + 1u + tid; i < ${i}u; i += ${l}u) {
      output[base + i * ${i}u + j] /= L_jj;
    }
    storageBarrier();
  }
}
`.trim(),numInputs:1,numOutputs:1,hasUniform:!1,passes:[{grid:E(a)}]}]}function z(e,t){let n=t.inputDtypes[0],r=t.inputShapes[0],i=r[r.length-2],a=r[r.length-1],o=Math.min(i,a),c=s(r.slice(0,-2)),l=n===`float16`,u=x(n,!0),d=_(Math.max(i,a),e.limits.maxComputeWorkgroupSizeX);return[{code:`
${l?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input: array<${u}>;
@group(0) @binding(1) var<storage, read_write> lu: array<${u}>;
@group(0) @binding(2) var<storage, read_write> pivots: array<i32>;
@group(0) @binding(3) var<storage, read_write> perm: array<i32>;

var<workgroup> pivot_row: u32;
var<workgroup> pivot_val: ${u};

@compute @workgroup_size(${d})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let batch = wg_id.x + wg_id.y * ${T}u;
  if (batch >= ${c}u) {
    return;
  }

  let lu_base = batch * ${i*a}u;
  let piv_base = batch * ${o}u;
  let perm_base = batch * ${i}u;
  let tid = local_id.x;

  // Copy input to lu
  for (var idx = tid; idx < ${i*a}u; idx += ${d}u) {
    lu[lu_base + idx] = input[lu_base + idx];
  }
  // Initialize permutation
  for (var idx = tid; idx < ${i}u; idx += ${d}u) {
    perm[perm_base + idx] = i32(idx);
  }
  storageBarrier();

  // LU decomposition with partial pivoting
  for (var j = 0u; j < ${o}u; j++) {
    // Step 1: Thread 0 finds pivot (max abs value in column j, rows >= j)
    if (tid == 0u) {
      var max_val = abs(lu[lu_base + j * ${a}u + j]);
      var max_row = j;
      for (var i = j + 1u; i < ${i}u; i++) {
        let val = abs(lu[lu_base + i * ${a}u + j]);
        if (val > max_val) {
          max_val = val;
          max_row = i;
        }
      }
      pivot_row = max_row;
      pivot_val = lu[lu_base + max_row * ${a}u + j];
      pivots[piv_base + j] = i32(max_row);
    }
    workgroupBarrier();

    // Step 2: Swap rows j and pivot_row (threads collaborate)
    let pr = pivot_row;
    if (pr != j) {
      for (var col = tid; col < ${a}u; col += ${d}u) {
        let tmp = lu[lu_base + j * ${a}u + col];
        lu[lu_base + j * ${a}u + col] = lu[lu_base + pr * ${a}u + col];
        lu[lu_base + pr * ${a}u + col] = tmp;
      }
      if (tid == 0u) {
        let tmp_p = perm[perm_base + j];
        perm[perm_base + j] = perm[perm_base + pr];
        perm[perm_base + pr] = tmp_p;
      }
    }
    storageBarrier();

    // Step 3: Compute L[i][j] and update submatrix
    // Each thread handles one row i > j
    for (var i = j + 1u + tid; i < ${i}u; i += ${d}u) {
      let factor = lu[lu_base + i * ${a}u + j] / pivot_val;
      lu[lu_base + i * ${a}u + j] = factor; // L[i][j]
      for (var k = j + 1u; k < ${a}u; k++) {
        lu[lu_base + i * ${a}u + k] -= factor * lu[lu_base + j * ${a}u + k];
      }
    }
    storageBarrier();
  }
}
`.trim(),numInputs:1,numOutputs:3,hasUniform:!1,passes:[{grid:E(c)}]}]}function B(e,t,n){let r=t.inputDtypes[0],i=t.inputShapes[0],a=i[i.length-1],o=s(i.slice(0,-2)),c=r===`float16`,l=x(r,!0),u=`${l}(${n.tolerance})`,d=_(Math.max(a,1),e.limits.maxComputeWorkgroupSizeX);return[{code:`
${c?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input: array<${l}>;
@group(0) @binding(1) var<storage, read_write> diagonalized: array<${l}>;
@group(0) @binding(2) var<storage, read_write> vectors: array<${l}>;

var<workgroup> done: u32;
var<workgroup> rot_active: u32;
var<workgroup> rot_c: ${l};
var<workgroup> rot_s: ${l};
var<workgroup> rot_app: ${l};
var<workgroup> rot_aqq: ${l};
var<workgroup> rot_apq: ${l};

fn mat_idx(base: u32, row: u32, col: u32) -> u32 {
  return base + row * ${a}u + col;
}

fn sym_idx(base: u32, row: u32, col: u32) -> u32 {
  return mat_idx(base, max(row, col), min(row, col));
}

@compute @workgroup_size(${d})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let batch = wg_id.x + wg_id.y * ${T}u;
  if (batch >= ${o}u) {
    return;
  }

  let base = batch * ${a*a}u;
  let tid = local_id.x;

  for (var idx = tid; idx < ${a*a}u; idx += ${d}u) {
    let row = idx / ${a}u;
    let col = idx % ${a}u;
    diagonalized[base + idx] = select(
      ${l}(0),
      input[base + idx],
      row >= col,
    );
    vectors[base + idx] = select(${l}(0), ${l}(1), row == col);
  }
  storageBarrier();

  for (var sweep = 0u; sweep < ${n.maxSweeps}u; sweep++) {
    if (tid == 0u) {
      var max_abs = ${l}(1);
      var max_offdiag = ${l}(0);
      for (var idx = 0u; idx < ${a*a}u; idx++) {
        let row = idx / ${a}u;
        let col = idx % ${a}u;
        let value = abs(diagonalized[base + idx]);
        max_abs = max(max_abs, value);
        if (row > col) {
          max_offdiag = max(max_offdiag, value);
        }
      }
      done = select(0u, 1u, max_offdiag <= ${u} * max_abs);
    }
    let done_uniform = workgroupUniformLoad(&done);
    if (done_uniform != 0u) {
      break;
    }

    for (var p = 0u; p + 1u < ${a}u; p++) {
      for (var q = p + 1u; q < ${a}u; q++) {
        if (tid == 0u) {
          rot_app = diagonalized[mat_idx(base, p, p)];
          rot_aqq = diagonalized[mat_idx(base, q, q)];
          rot_apq = diagonalized[sym_idx(base, p, q)];
          if (rot_apq == ${l}(0)) {
            rot_active = 0u;
            rot_c = ${l}(1);
            rot_s = ${l}(0);
          } else {
            let tau = (rot_aqq - rot_app) / (${l}(2) * rot_apq);
            let tau_sign = select(${l}(-1), ${l}(1), tau >= ${l}(0));
            let t = tau_sign / (abs(tau) + sqrt(tau * tau + ${l}(1)));
            rot_c = inverseSqrt(t * t + ${l}(1));
            rot_s = t * rot_c;
            rot_active = 1u;
          }
        }
        workgroupBarrier();

        if (rot_active != 0u) {
          for (var k = tid; k < ${a}u; k += ${d}u) {
            if (k != p && k != q) {
              let kp = sym_idx(base, k, p);
              let kq = sym_idx(base, k, q);
              let akp = diagonalized[kp];
              let akq = diagonalized[kq];
              let next_kp = rot_c * akp - rot_s * akq;
              let next_kq = rot_s * akp + rot_c * akq;
              diagonalized[kp] = next_kp;
              diagonalized[kq] = next_kq;
            } else if (k == p) {
              diagonalized[mat_idx(base, p, p)] =
                rot_c * rot_c * rot_app - ${l}(2) * rot_s * rot_c * rot_apq + rot_s * rot_s * rot_aqq;
              diagonalized[sym_idx(base, p, q)] = ${l}(0);
            } else {
              diagonalized[mat_idx(base, q, q)] =
                rot_s * rot_s * rot_app + ${l}(2) * rot_s * rot_c * rot_apq + rot_c * rot_c * rot_aqq;
            }

            let vp = mat_idx(base, k, p);
            let vq = mat_idx(base, k, q);
            let vkp = vectors[vp];
            let vkq = vectors[vq];
            vectors[vp] = rot_c * vkp - rot_s * vkq;
            vectors[vq] = rot_s * vkp + rot_c * vkq;
          }
        }
        storageBarrier();
      }
    }
  }
}
`.trim(),numInputs:1,numOutputs:2,hasUniform:!1,passes:[{grid:E(o)}]}]}function V(e,t,n,r){return new Uint8Array(new Uint32Array([e,t,n,+!!r]).buffer)}function H(e,t,n){let r=t.inputDtypes[0],i=t.inputShapes[0],a=i[i.length-1],o=s(i.slice(0,-1));if(s(n.factors)!==a)throw Error(`fft: factorization ${n.factors} does not match size ${a}`);let c=r===`float16`,l=x(r,!0),u=Math.min(256,_(0,e.limits.maxComputeWorkgroupSizeX)),d=Math.max(1,...n.factors),f=n.inverse?`6.283185307179586`:`-6.283185307179586`,p=n.factors.map(e=>`
  digit = remaining % ${e}u;
  remaining = remaining / ${e}u;
  stride = stride * ${e}u;
  reversed = reversed + digit * (${a}u / stride);`).join(``),m=`
${c?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input_real: array<${l}>;
@group(0) @binding(1) var<storage, read> input_imag: array<${l}>;
@group(0) @binding(2) var<storage, read_write> output_real: array<${l}>;
@group(0) @binding(3) var<storage, read_write> output_imag: array<${l}>;

struct FftParams {
  phase: u32,
  radix: u32,
  prev: u32,
  normalize: u32,
}

@group(1) @binding(0) var<uniform> fft_params: FftParams;

fn digit_reversed_index(index: u32) -> u32 {
  var remaining = index;
  var stride = 1u;
  var reversed = 0u;
  var digit = 0u;
${p}
  return reversed;
}

@compute @workgroup_size(${u})
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let global = global_id.x + global_id.y * ${T*u}u;

  if (fft_params.phase == 0u) {
    if (global >= ${o*a}u) {
      return;
    }
    let batch = global / ${a}u;
    let out_idx = global % ${a}u;
    let source = batch * ${a}u + digit_reversed_index(out_idx);
    output_real[global] = input_real[source];
    output_imag[global] = input_imag[source];
    return;
  }

  let butterflies_per_batch = ${a}u / fft_params.radix;
  if (global >= ${o}u * butterflies_per_batch) {
    return;
  }

  let batch = global / butterflies_per_batch;
  let local = global % butterflies_per_batch;
  let j = local % fft_params.prev;
  let group = local / fft_params.prev;
  let span = fft_params.prev * fft_params.radix;
  let start = batch * ${a}u + group * span + j;
  let scale = select(1.0, 1.0 / f32(${a}u), fft_params.normalize != 0u);

  var scratch_real: array<f32, ${d}>;
  var scratch_imag: array<f32, ${d}>;

  for (var q = 0u; q < fft_params.radix; q++) {
    let idx = start + q * fft_params.prev;
    let angle = ${f} * f32(q * j) / f32(span);
    let c = cos(angle);
    let s = sin(angle);
    let xr = f32(output_real[idx]);
    let xi = f32(output_imag[idx]);
    scratch_real[q] = xr * c - xi * s;
    scratch_imag[q] = xr * s + xi * c;
  }

  for (var p = 0u; p < fft_params.radix; p++) {
    var sum_real = 0.0;
    var sum_imag = 0.0;
    for (var q = 0u; q < fft_params.radix; q++) {
      let angle = ${f} * f32(q * p) / f32(fft_params.radix);
      let c = cos(angle);
      let s = sin(angle);
      let xr = scratch_real[q];
      let xi = scratch_imag[q];
      sum_real += xr * c - xi * s;
      sum_imag += xr * s + xi * c;
    }
    let idx = start + p * fft_params.prev;
    output_real[idx] = ${l}(sum_real * scale);
    output_imag[idx] = ${l}(sum_imag * scale);
  }
}
`.trim(),h=[{grid:E(Math.ceil(o*a/u)),uniform:V(0,1,1,!1)}],g=1;for(let e=0;e<n.factors.length;e++){let t=n.factors[e];h.push({grid:E(Math.ceil(o*a/t/u)),uniform:V(1,t,g,n.inverse&&e===n.factors.length-1)}),g*=t}return[{code:m,numInputs:2,numOutputs:2,hasUniform:!0,passes:h}]}function U(e,t){switch(t.name){case`Sort`:return F(e,t.type);case`Argsort`:return I(e,t.type);case`TriangularSolve`:return L(e,t.type,t.params);case`Cholesky`:return R(e,t.type);case`LU`:return z(e,t.type);case`JacobiEigh`:return B(e,t.type,t.params);case`Fft`:return H(e,t.type,t.params);default:throw new r(t.name,`webgpu`)}}const W=4096,G=new WeakMap;function K(e){return{querySet:e.createQuerySet({type:`timestamp`,count:W}),resolve:e.createBuffer({size:W*8,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),dst:e.createBuffer({size:W*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),nextIndex:0,entries:[]}}function q(e){if(!e.features.has(`timestamp-query`))return;let t=G.get(e);t&&t.nextIndex>=W&&(Z(e,t),t=void 0),t||(t=K(e),G.set(e,t),u(()=>{let t=G.get(e);t&&t.entries.length>0&&Z(e,t),G.delete(e)}));let n=t.nextIndex,r=n+1;return t.nextIndex+=2,{batch:t,beginIndex:n,endIndex:r}}function J(e){if(a())return q(e)}function Y(e,t,n,r,i){let a=v(n);a.properties.push([`passes`,`${r}`]),a.properties.push([`source`,i]),t.batch.entries.push({...a,beginIndex:t.beginIndex,endIndex:t.endIndex}),X(e)}function X(e){queueMicrotask(()=>{let t=G.get(e);t&&t.entries.length>0&&(Z(e,t),G.set(e,K(e)))})}function Z(e,t){if(t.entries.length===0)return;let n=t.nextIndex,r=e.createCommandEncoder();r.resolveQuerySet(t.querySet,0,n,t.resolve,0),r.copyBufferToBuffer(t.resolve,0,t.dst,0,n*8),e.queue.submit([r.finish()]);let{entries:i}=t;t.dst.mapAsync(GPUMapMode.READ).then(()=>{try{let e=new BigInt64Array(t.dst.getMappedRange()),n=e[i[i.length-1].endIndex],r=performance.now();for(let t of i)l(`webgpu`,t,r+Number(e[t.beginIndex]-n)/1e6,r+Number(e[t.endIndex]-n)/1e6)}finally{t.dst.unmap(),t.querySet.destroy(),t.resolve.destroy(),t.dst.destroy()}})}const Q=64*1024*1024;var ne=class{device;type=`webgpu`;maxArgs;pipelines;syncReader;buffers;nextSlot;#e=new Map;#t;#n=new Map;constructor(e){this.device=e,m>=3&&e.adapterInfo&&console.info(`webgpu adapter:`,e.adapterInfo.vendor,e.adapterInfo.architecture),this.maxArgs=this.device.limits.maxStorageBuffersPerShaderStage-1,this.pipelines=new oe(e),this.syncReader=new N(e),this.buffers=new Map,this.nextSlot=1,this.#t=this.#s(4),e.addEventListener(`uncapturederror`,e=>{console.error(`Uncaptured error in WebGPU backend:`,e.error.message)})}malloc(e,t){if(t&&t.byteLength!==e)throw Error(`initialData size does not match buffer size`);let n=Math.ceil(e/4)*4||4,r=e===0?this.#t:this.#a(n);if(t&&e>0)if(t.byteLength%4==0)this.device.queue.writeBuffer(r,0,t);else{let e=t.byteLength-t.byteLength%4;e>0&&this.device.queue.writeBuffer(r,0,t,0,e);let n=new Uint8Array(4);n.set(t.subarray(e)),this.device.queue.writeBuffer(r,e,n)}let i=this.nextSlot++;return this.buffers.set(i,{buffer:r,size:e,allocatedSize:n,ref:1}),i}incRef(e){let t=this.buffers.get(e);if(!t)throw new f(e);t.ref++}decRef(e){let t=this.buffers.get(e);if(!t)throw new f(e);t.ref--,t.ref===0&&(this.buffers.delete(e),t.buffer!==this.#t&&this.#o(t.buffer,t.allocatedSize))}async read(e,t,n){let{buffer:r,size:i}=this.#i(e);if(r===this.#t)return new Uint8Array;t===void 0&&(t=0),n===void 0&&(n=i-t);let a=Math.ceil(n/4)*4,o=this.#s(a,{read:!0});try{let e=this.device.createCommandEncoder();e.copyBufferToBuffer(r,t,o,0,a),this.device.queue.submit([e.finish()]),await o.mapAsync(GPUMapMode.READ);let i=o.getMappedRange();return new Uint8Array(i.slice(),0,n)}finally{o.destroy()}}readSync(e,t,n){let{buffer:r,size:i}=this.#i(e);return r===this.#t?new Uint8Array:(t===void 0&&(t=0),n===void 0&&(n=i-t),this.syncReader.read(r,t,n))}#r(e){let n=t.hash(e),r=this.#e.get(n);return r||(r=re(this.device,e),this.#e.set(n,r)),r}async prepareKernel(e){let t=this.#r(e),n=await this.pipelines.prepare(t);return new c(e,[{...t,pipeline:n}])}prepareKernelSync(e){let t=this.#r(e),n=this.pipelines.prepareSync(t);return new c(e,[{...t,pipeline:n}])}async prepareRoutine(e){let t=U(this.device,e);return new c(e,await Promise.all(t.map(async e=>{let t=await this.pipelines.prepare(e);return{...e,pipeline:t}})))}prepareRoutineSync(e){return new c(e,U(this.device,e).map(e=>{let t=this.pipelines.prepareSync(e);return{...e,pipeline:t}}))}dispatch(e,t,n){let r=t.map(e=>this.#i(e).buffer),i=n.map(e=>this.#i(e).buffer);ie(this.device,e,r,i)}#i(e){let t=this.buffers.get(e);if(!t)throw new f(e);return{buffer:t.buffer,size:t.size}}#a(e){if(e>Q)return this.#s(e);let t=this.#n.get(e),n=t?.pop();return t&&t.length===0&&this.#n.delete(e),n??this.#s(e)}#o(e,t){if(t>Q){e.destroy();return}let n=this.#n.get(t);if(!n){this.#n.set(t,[e]);return}if(n.length>=64){e.destroy();return}n.push(e)}#s(e,{mapped:t=!1,read:n=!1}={}){if(n&&t)throw Error(`mapped and read cannot both be true`);return this.device.createBuffer({size:e,usage:n?GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:t})}};function re(t,r){let i=M(t,r);if(i)return i;let a=n(r);m>=3&&console.info(`kernel.exp: ${r.exp}\ntune.exp: ${a.exp}`);let{nargs:o,reduction:s}=r,c=Array.from({length:o},(e,t)=>`in${t}`),l=new b;l.emitPreamble(t,[a.exp,a.epilogue]);let u=Array.from({length:o},()=>null);a.exp.fold(e=>{e.op===`GlobalIndex`&&(u[e.arg[0]]=e.dtype)}),a.epilogue?.fold(e=>{e.op===`GlobalIndex`&&(u[e.arg[0]]=e.dtype)});for(let e=0;e<o;e++){let t=x(u[e]??`float32`,!0);l.emit(`@group(0) @binding(${e}) var<storage, read> ${c[e]} : array<${t}>;`)}let d=x(r.dtype,!0);l.emit(`@group(0) @binding(${o}) var<storage, read_write> result : array<${d}>;`);let f=s?a.size.groups??1:1,p=s&&f>1;if(p&&a.threadCount%f!==0)throw Error(`WebGPU grouped reduction has invalid thread count`);if(p&&f>t.limits.maxComputeWorkgroupSizeX)throw Error(`WebGPU grouped reduction exceeds workgroup size limit`);let h=p?f:_(a.threadCount,256),v=p?a.threadCount/f:Math.ceil(a.threadCount/h),[y,S]=E(v);if(p){let e=x(s.dtype);for(let t=0;t<(a.size.upcast??1);t++)l.emit(`var<workgroup> partial${t}: array<${e}, ${f}>;`)}if(l.emit(``,`@compute @workgroup_size(${h})`),p)l.emit(`fn main(`,l.pushIndent,`@builtin(local_invocation_id) lid : vec3<u32>,`,`@builtin(workgroup_id) wg_id : vec3<u32>,`,l.popIndent,`) {`,l.pushIndent),S===1?l.emit(`if (wg_id.x >= ${v}u) { return; }`,`let gidx: i32 = i32(wg_id.x);`):l.emit(`if (${y}u * wg_id.y + wg_id.x >= ${v}u) { return; }`,`let gidx: i32 = i32(${y}u * wg_id.y + wg_id.x);`),l.emit(`let group: i32 = i32(lid.x);`);else if(l.emit(`fn main(@builtin(global_invocation_id) id : vec3<u32>) {`,l.pushIndent),S===1)l.emit(`if (id.x >= ${a.threadCount}) { return; }`,`let gidx: i32 = i32(id.x);`);else{let e=y*h;l.emit(`if (${e} * id.y + id.x >= ${a.threadCount}) { return; }`,`let gidx: i32 = i32(${e} * id.y + id.x);`)}l.emitPhonyAssignments(c);let T=new w(l,c);if(s){let t=a.size.unroll??1,n=a.size.upcast??1,r=[...Array(n)].map((e,t)=>`acc${t}`);for(let e=0;e<n;e++)l.emit(`var ${r[e]}: ${x(s.dtype)} = ${C(s.dtype,s.identity)};`);l.emit(`for (var ridx: i32 = 0; ridx < ${a.size.reduce}; ridx++) {`,l.pushIndent);let i=[],o=new Map;for(let e=0;e<n;e++){i.push([]);for(let n=0;n<t;n++){let t=a.exp.substitute({upcast:g.i32(e),unroll:g.i32(n)});i[e].push(t.simplify(o)),T.countReferences(i[e][n])}}let c=i.map(t=>t.map(e=>T.run(e)).map(e));for(let e=0;e<n;e++){let n=c[e][0];for(let r=1;r<t;r++)if(s.op===`Add`)n=`${n} + ${c[e][r]}`;else if(s.op===`Mul`)n=`${n} * ${c[e][r]}`;else if(s.op===`Min`)n=s.dtype===`bool`?`(${n} && ${c[e][r]})`:`min(${n}, ${c[e][r]})`;else if(s.op===`Max`)n=s.dtype===`bool`?`(${n} || ${c[e][r]})`:`max(${n}, ${c[e][r]})`;else throw Error(`Unsupported reduction op: ${s.op}`);if(s.op===`Add`)l.emit(`${r[e]} += ${n};`);else if(s.op===`Mul`)l.emit(`${r[e]} *= ${n};`);else if(s.op===`Min`)s.dtype===`bool`?l.emit(`${r[e]} = ${r[e]} && ${n};`):l.emit(`${r[e]} = min(${r[e]}, ${n});`);else if(s.op===`Max`)s.dtype===`bool`?l.emit(`${r[e]} = ${r[e]} || ${n};`):l.emit(`${r[e]} = max(${r[e]}, ${n});`);else throw Error(`Unsupported reduction op: ${s.op}`)}if(l.emit(l.popIndent,`}`),p){for(let e=0;e<n;e++)l.emit(`partial${e}[lid.x] = ${r[e]};`);l.emit(`workgroupBarrier();`);for(let e=f/2;e>=1;e/=2){l.emit(`if (lid.x < ${e}u) {`,l.pushIndent);for(let t=0;t<n;t++)l.emit(`partial${t}[lid.x] = ${ee(s.op,s.dtype,`partial${t}[lid.x]`,`partial${t}[lid.x + ${e}u]`)};`);l.emit(l.popIndent,`}`,`workgroupBarrier();`)}}T.reset();let u=[],m=[];for(let e=0;e<n;e++){let t=a.outputIdxExp.substitute({upcast:g.i32(e)});u.push(t.simplify(o)),T.countReferences(u[e]),m.push(a.epilogue.substitute({acc:g.variable(s.dtype,r[e]),upcast:g.i32(e)}).simplify(o)),T.countReferences(m[e])}if(p){l.emit(`if (lid.x == 0u) {`,l.pushIndent);for(let e=0;e<n;e++)l.emit(`${r[e]} = partial${e}[0u];`)}for(let t=0;t<n;t++){let n=e(T.run(u[t])),r=e(T.run(m[t]));d!==x(m[t].dtype)&&(r=`${d}(${r})`),l.emit(`result[${n}] = ${r};`)}p&&l.emit(l.popIndent,`}`)}else{T.countReferences(a.exp);let t=e(T.run(a.exp));d!==x(a.exp.dtype)&&(t=`${d}(${t})`),l.emit(`result[gidx] = ${t};`)}return l.emit(l.popIndent,`}`),{code:l.toString(),numInputs:o,numOutputs:1,hasUniform:!1,passes:[{grid:[y,S]}]}}function ie(e,t,n,r){let{data:i,source:a}=t,o=e.createCommandEncoder();for(let{pipeline:t,...c}of i){if(n.length!==c.numInputs||r.length!==c.numOutputs)throw Error(`webgpu: expected ${c.numInputs} inputs and ${c.numOutputs} outputs, got ${n.length} inputs and ${r.length} outputs`);let i=c.passes.filter(({grid:e})=>s(e)>0);if(i.length===0)continue;let l=J(e),u=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[...n.map((e,t)=>({binding:t,resource:{buffer:e}})),...r.map((e,t)=>({binding:n.length+t,resource:{buffer:e}}))]}),d=null,f=0;if(c.hasUniform){let[n,r]=ae(e,i.map(({uniform:e})=>e));f=r,d=e.createBindGroup({layout:t.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:n,size:r}}]})}for(let e=0;e<i.length;e++){let{grid:n}=i[e],r;if(l){let t=e===0,n=e===i.length-1;(t||n)&&(r={querySet:l.batch.querySet,...t?{beginningOfPassWriteIndex:l.beginIndex}:{},...n?{endOfPassWriteIndex:l.endIndex}:{}})}let a=o.beginComputePass({timestampWrites:r});a.setPipeline(t),a.setBindGroup(0,u),d&&a.setBindGroup(1,d,[e*f]),a.dispatchWorkgroups(n[0],n[1]),a.end()}l&&Y(e,l,a,i.length,c.code)}e.queue.submit([o.finish()])}function ae(e,t){for(let e of t)if(!e||e.byteLength===0||e.byteLength!==t[0].byteLength)throw Error(`webgpu: Uniform mismatch between shader passes`);let n=e.limits.minUniformBufferOffsetAlignment,r=Math.ceil(t[0].byteLength/n)*n,i=e.createBuffer({size:r*t.length,usage:GPUBufferUsage.UNIFORM,mappedAtCreation:!0}),a=new Uint8Array(i.getMappedRange());for(let e=0;e<t.length;e++)a.set(t[e],e*r);return i.unmap(),[i,r]}var oe=class{device;cache;inProgress;constructor(e){this.device=e,this.cache=new Map,this.inProgress=new Map}#e(e){if(e.numInputs+e.numOutputs>this.device.limits.maxStorageBuffersPerShaderStage){let t=e.numInputs+e.numOutputs,n=this.device.limits.maxStorageBuffersPerShaderStage;throw Error(`Too many buffers (${t}) for WebGPU pipeline (max: ${n})`)}let t=[this.device.createBindGroupLayout({entries:o(e.numInputs+e.numOutputs).map(t=>({binding:t,visibility:GPUShaderStage.COMPUTE,buffer:{type:t<e.numInputs?`read-only-storage`:`storage`}}))})];return e.hasUniform&&t.push(this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`uniform`,hasDynamicOffset:!0}}]})),this.device.createPipelineLayout({bindGroupLayouts:t})}async prepare(e){let t=this.cache.get(e.code);if(t)return t;let n=this.inProgress.get(e.code);if(n)return await n;m>=2&&console.info(`=========== WebGPU shader ===========
`+e.code);let r=this.device.createShaderModule({code:e.code}),i=(async()=>{this.device.pushErrorScope(`validation`);try{let t=await this.device.createComputePipelineAsync({layout:this.#e(e),compute:{module:r,entryPoint:`main`}});return await this.device.popErrorScope(),t}catch{let t=await $(r,await this.device.popErrorScope(),e.code);throw Error(t)}})();this.inProgress.set(e.code,i);let a=await i;return this.cache.set(e.code,a),a}prepareSync(e){let t=this.cache.get(e.code);if(t)return t;m>=2&&console.info(`=========== WebGPU shader ===========
`+e.code);let n=this.device.createShaderModule({code:e.code});this.device.pushErrorScope(`validation`);let r=this.device.createComputePipeline({layout:this.#e(e),compute:{module:n,entryPoint:`main`}});return this.device.popErrorScope().then(async t=>{if(t!==null){let r=await $(n,t,e.code);console.error(r)}}),this.cache.set(e.code,r),r}};async function $(e,t,n){let r=`Failed to compile shader: ${t?t.message:`(no error scope)`}`,i=await e.getCompilationInfo();for(let e of i.messages)r+=`\n  [${e.type} at ${e.lineNum}:${e.linePos}] ${e.message}`;return n&&(r+=`\n\n${n}`),r}export{ne as WebGPUBackend};