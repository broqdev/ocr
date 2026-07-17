import{_ as e,a as t,c as n,d as r,f as i,g as a,h as o,i as s,l as c,m as l,n as u,o as d,p as f,r as p,s as m,u as h,v as g,x as _,y as v}from"./jaxJsTable.worker-xonMtyyD.js";const y=String.raw`
fn nan() -> f32 { let bits = 0xffffffffu; return bitcast<f32>(bits); }
fn inf() -> f32 { let bits = 0x7f800000u; return bitcast<f32>(bits); }
`.trim();var b=class{pushIndent=Symbol(`pushIndent`);popIndent=Symbol(`popIndent`);lines=[];#e=``;emit(...e){for(let t of e)t===this.pushIndent?this.#e+=`  `:t===this.popIndent?this.#e=this.#e.slice(0,-2):this.lines.push(t?this.#e+t:``)}emitPreamble(e,t){let n=!1,r=new Map;for(let e of t)e!=null&&(n||=e.some(e=>e.dtype===`float16`),r=l(r,e.distinctOps()));if(n){if(!e.features.has(`shader-f16`))throw Error(`WebGPU device does not support shader-f16 feature`);this.emit(`enable f16;`)}this.emit(y),r.has(`Threefry2x32`)&&this.emit(`
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
`)}};function x(e,t=!1){switch(e){case`bool`:return t?`i32`:`bool`;case`int32`:return`i32`;case`uint32`:return`u32`;case`float32`:return`f32`;case`float16`:return`f16`;default:throw Error(`Unsupported dtype for WebGPU: ${e}`)}}function S(e){switch(e){case`bool`:return`1`;case`int32`:return`2147483647`;case`uint32`:return`4294967295u`;case`float32`:return`inf()`;case`float16`:return`f16(inf())`;default:throw Error(`Unsupported dtype for WebGPU: ${e}`)}}function C(e,t){if(e===`bool`)return t?`true`:`false`;if(e===`int32`)return t.toString();if(e===`uint32`)return t.toString()+`u`;if(e===`float32`)return Number.isNaN(t)?`nan()`:Number.isFinite(t)?`f32(`+t.toString()+`)`:t>0?`inf()`:`-inf()`;if(e===`float16`)return Number.isNaN(t)?`f16(nan())`:Number.isFinite(t)?`f16(`+t.toString()+`)`:t>0?`f16(inf())`:`f16(-inf())`;throw Error(`Unsupported const dtype: ${e}`)}function ee(e,t,n,r){if(e===`Add`)return`(${n} + ${r})`;if(e===`Mul`)return`(${n} * ${r})`;if(e===`Min`)return t===`bool`?`(${n} && ${r})`:`min(${n}, ${r})`;if(e===`Max`)return t===`bool`?`(${n} || ${r})`:`max(${n}, ${r})`;throw Error(`Unsupported reduction op: ${e}`)}var w=class{wb;args;#e=0;#t=new Map;#n=new Set;#r=new Map;constructor(e,t){this.wb=e,this.args=t}#i(){return`alu${this.#e++}`}#a(e){return e.match(/^alu[0-9]+$/)}countReferences(e){if(this.#t.set(e,(this.#t.get(e)??0)+1),!this.#n.has(e)){this.#n.add(e);for(let t of e.src)this.countReferences(t)}}reset(){this.#t.clear(),this.#n.clear(),this.#r.clear()}run(e){if(this.#r.has(e))return this.#r.get(e);let{op:t,src:r,dtype:a,arg:o}=e,s=``;if(p.Binary.has(t)||p.Compare.has(t)){let e=this.run(r[0]),n=this.run(r[1]);if(t===`Add`)s=a===`bool`?`(${e} || ${n})`:`(${e} + ${n})`;else if(t===`Sub`)s=`(${e} - ${n})`;else if(t===`Mul`)s=a===`bool`?`(${e} && ${n})`:`(${e} * ${n})`;else if(t===`Idiv`)s=i(a)?`trunc(${e} / ${n})`:`(${e} / ${n})`;else if(t===`Mod`)s=`(${e} % ${n})`;else if(t===`Min`)s=a===`bool`?`(${e} && ${n})`:`min(${g(e)}, ${g(n)})`;else if(t===`Max`)s=a===`bool`?`(${e} || ${n})`:`max(${g(e)}, ${g(n)})`;else if(t===`BitCombine`)s=o===`and`?`(${e} & ${n})`:o===`or`?`(${e} | ${n})`:a===`bool`?`(${e} != ${n})`:`(${e} ^ ${n})`;else if(t===`BitShift`)s=o===`shl`?`(${e} << ${n})`:`(${e} >> ${n})`;else if(t===`Cmplt`)s=`(${e} < ${n})`;else if(t===`Cmpne`)if(i(r[0].dtype)){let t=this.#a(e)?e:this.#i();t!==e&&this.wb.emit(`let ${t} = ${e};`),s=`(${t} != ${n} || min(${t}, ${x(r[0].dtype)}(inf())) != ${t})`}else s=`(${e} != ${n})`}else if(p.Unary.has(t))if(t===`Reciprocal`&&r[0].op===`Sqrt`)s=`inverseSqrt(${this.run(r[0].src[0])})`;else{let e=this.run(r[0]);if(t===`Sin`)s=`sin(${g(e)})`;else if(t===`Cos`)s=`cos(${g(e)})`;else if(t===`Asin`)s=`asin(${g(e)})`;else if(t===`Atan`)s=`atan(${g(e)})`;else if(t===`Exp`)s=`exp(${g(e)})`;else if(t===`Log`)s=`log(${g(e)})`;else if(t===`Erf`||t===`Erfc`){let n=t===`Erf`?`erf`:`erfc`;s=a===`float32`?`${n}(${g(e)})`:`${x(a)}(${n}(f32(${g(e)})))`}else if(t===`Sqrt`)s=`sqrt(${g(e)})`;else if(t===`Reciprocal`)s=`(1.0 / ${e})`;else if(t===`Floor`)s=`floor(${g(e)})`;else if(t===`Ceil`)s=`ceil(${g(e)})`;else if(t===`Cast`){let t=x(r[0].dtype),n=x(a);if(i(r[0].dtype)&&!(i(a)||a===`bool`)){let r=S(a),i=this.#a(e)?e:this.#i();i!==e&&this.wb.emit(`let ${i}: ${t} = ${g(e)};`),s=`select(${n}(${i}), ${r}, ${i} >= ${t}(${r}))`}else s=`${n}(${g(e)})`}else t===`Bitcast`&&(s=`bitcast<${x(a)}>(${g(e)})`)}else if(t===`Where`)s=`select(${g(this.run(r[2]))}, ${g(this.run(r[1]))}, ${g(this.run(r[0]))})`;else if(t===`Threefry2x32`){let e=this.#i(),[i,c,l,u]=r.map(e=>g(this.run(e)));if(this.wb.emit(`let ${e} = threefry2x32(vec2(${i}, ${c}), vec2(${l}, ${u}));`),o===`xor`)s=`(${e}.x ^ ${e}.y)`;else if(o===0)s=`${e}.x`;else if(o===1)s=`${e}.y`;else throw new n(t,a,`webgpu`,o)}else if(t===`Const`)return C(a,o);else if(t===`Special`)return o[0];else if(t===`Variable`)return o;else t===`GlobalIndex`&&(s=`${this.args[o[0]]}[${g(this.run(r[0]))}]`,a===`bool`&&(s=`(${s} != 0)`));if(!s)throw new n(t,a,`webgpu`,o);let c=x(a);if((this.#t.get(e)??0)>1){let t=this.#i();return this.#r.set(e,t),this.wb.emit(`let ${t}: ${c} = ${g(s)};`),t}else return this.#r.set(e,s),s}};const T=16384;function E(e){let t=e,n=1;return e>65535&&(t=T,n=Math.ceil(e/T)),[t,n]}function D(e){return e===`float16`?`float32`:e===`bool`?`int32`:e}function O({name:e,dtype:t,uniformDtype:n}){let r=u.variable(n,`uniforms.${e}`);return t===`float16`?u.cast(`float16`,r):t===`bool`?u.cmpne(r,u.i32(0)):r}function k(e,t,n,r){switch(n){case`float32`:e.setFloat32(t,r,!0);break;case`int32`:e.setInt32(t,r,!0);break;case`uint32`:e.setUint32(t,r,!0);break;default:throw Error(`Unsupported dtype for constant uniform: ${n}`)}}function A(e){let t=[];return[e.rewrite(e=>{if(e.op!==`Const`||e.arg===0)return;let n={name:`c${t.length}`,dtype:e.dtype,uniformDtype:D(e.dtype),value:e.arg};return t.push(n),O(n)}),t]}function j(e){let t=new Uint8Array(e.length*4),n=new DataView(t.buffer);return e.forEach((e,t)=>k(n,t*4,e.uniformDtype,e.value)),t}function M(e,t){if(t.nargs!==0||t.reduction)return null;let n=t.exp.substitute({gidx:u.special(`int32`,`gidx`,t.size)}).simplify(),i=[];[n,i]=A(n);let a=new b;a.emitPreamble(e,[n]),i.length>0&&a.emit(`struct Uniforms {`,a.pushIndent,...i.map(e=>`${e.name}: ${x(e.uniformDtype)},`),a.popIndent,`}
`);let o=x(t.dtype,!0);a.emit(`@group(0) @binding(0) var<storage, read_write> result : array<${o}>;`),i.length>0&&a.emit(`@group(1) @binding(0) var<uniform> uniforms: Uniforms;`);let s=r(t.size,256),[c,l]=E(Math.ceil(t.size/s));if(a.emit(``,`@compute @workgroup_size(${s})`,`fn main(@builtin(global_invocation_id) id : vec3<u32>) {`,a.pushIndent),l===1)a.emit(`if (id.x >= ${t.size}) { return; }`,`let gidx: i32 = i32(id.x);`);else{let e=c*s;a.emit(`if (${e} * id.y + id.x >= ${t.size}) { return; }`,`let gidx: i32 = i32(${e} * id.y + id.x);`)}let d=new w(a,[]);d.countReferences(n);let f=g(d.run(n));return o!==x(n.dtype)&&(f=`${o}(${f})`),a.emit(`result[gidx] = ${f};`,a.popIndent,`}`),{code:a.toString(),numInputs:0,numOutputs:1,hasUniform:i.length>0,passes:[{grid:[c,l],uniform:i.length>0?j(i):void 0}]}}var N=class e{device;static alphaModes=[`opaque`,`premultiplied`];static width=256;static height=256;initialized=!1;deviceStorage;deviceContexts;hostStorage;hostContext;constructor(e){this.device=e}#e(){if(typeof OffscreenCanvas>`u`)throw Error(`OffscreenCanvas is not available in this environment, so you cannot read data from WebGPU synchronously. Consider using the async API.`);let t=()=>new OffscreenCanvas(e.width,e.height);this.deviceStorage=e.alphaModes.map(t),this.deviceContexts=this.deviceStorage.map((t,n)=>{let r=t.getContext(`webgpu`);return r.configure({device:this.device,format:`bgra8unorm`,usage:GPUTextureUsage.COPY_DST,alphaMode:e.alphaModes[n]}),r}),this.hostStorage=t(),this.hostContext=this.hostStorage.getContext(`2d`,{willReadFrequently:!0}),this.initialized=!0}read(t,n,r){this.initialized||this.#e();let i=this.deviceStorage,a=this.deviceContexts,o=this.hostContext,s=Math.ceil(r/4),c=e.width*4,l=new ArrayBuffer(s*4);for(let r=0;r<a.length;r++){let u=a[r].getCurrentTexture(),d=(a,s,d)=>{let f=this.device.createCommandEncoder();f.copyBufferToTexture({buffer:t,bytesPerRow:c,offset:d+n},{texture:u},{width:a,height:s,depthOrArrayLayers:1});let p=f.finish();this.device.queue.submit([p]),o.clearRect(0,0,a,s),o.drawImage(i[r],0,0);let m=o.getImageData(0,0,a,s).data,h=new Uint8ClampedArray(l,d,4*a*s),g=e.alphaModes[r];for(let e=0;e<h.length;e+=4)g===`premultiplied`?h[e+3]=m[e+3]:(h[e]=m[e+2],h[e+1]=m[e+1],h[e+2]=m[e])},f=e.width*e.height,p=Math.floor(s/f),m=s%f,h=Math.floor(m/e.width);m%=e.width;let g=0;for(let t=0;t<p;t++)d(e.width,e.height,g),g+=f*4;h>0&&(d(e.width,h,g),g+=h*e.width*4),m>0&&d(m,1,g)}return new Uint8Array(l,0,r)}};function te(e){let t=new Uint32Array(3);return t[0]=e.kind===`sort`?0:1,t[1]=e.mergeStep??0,t[2]=e.mergeStage??0,new Uint8Array(t.buffer)}function P(e,t,n,a,o){let s=x(t,!0),c=1<<Math.ceil(Math.log2(n||1)),l=Math.ceil(c/2),u=r(l,e.limits.maxComputeWorkgroupSizeX),d=l/u,f=Math.log2(c),p=Math.min(f,Math.log2(u*2)),m=t===`float16`,h=i(t)?`${s}(nan())`:S(t),g=`
${m?`enable f16;`:``}
${y}

struct Uniforms {
  kind: u32, // 0 = sort, 1 = merge
  merge_step: u32, // half_block = 2^step
  merge_stage: u32, // only used for merge
}

@group(0) @binding(0) var<storage, read> input: array<${s}>;
@group(0) @binding(1) var<storage, read_write> output: array<${s}>;
${o?`@group(0) @binding(2) var<storage, read_write> output_idx: array<i32>;`:``}

@group(1) @binding(0) var<uniform> uniforms: Uniforms;

var<workgroup> shared_vals: array<${s}, ${u*2}>;
${o?`var<workgroup> shared_idx: array<i32, ${u*2}>;`:``}

fn compare(a: ${s}, b: ${s}) -> bool {
${i(t)?`
  let min_value = min(a, b);
  return a == min_value && b != min_value;`:`  return a < b;`}
}

fn compare_and_swap(i: u32, j: u32) {
  let val_i = shared_vals[i];
  let val_j = shared_vals[j];
${o?`
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

@compute @workgroup_size(${u})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let blockid = wg_id.x + wg_id.y * ${T}u;
  let batch = blockid / ${d}u;
  let wg_in_batch = blockid % ${d}u;

  let tid = local_id.x;
  let base = batch * ${n}u;

  if (uniforms.kind == 0u || (uniforms.kind == 1u && uniforms.merge_step == ${p-1}u)) {
    let wg_base = wg_in_batch * ${u*2}u;

    // Load data into shared memory (2 elements per thread)
    let idx0 = tid * 2u;
    let idx1 = tid * 2u + 1u;
    // Load from input for initial 'sort' pass, then from output (read-write) for 'merge' passes.
    if (uniforms.kind == 0u) {
      shared_vals[idx0] = select(${h}, input[base + wg_base + idx0], wg_base + idx0 < ${n}u);
      shared_vals[idx1] = select(${h}, input[base + wg_base + idx1], wg_base + idx1 < ${n}u);
${o?`
      shared_idx[idx0] = i32(wg_base + idx0);
      shared_idx[idx1] = i32(wg_base + idx1);`:``}
    } else {
      shared_vals[idx0] = select(${h}, output[base + wg_base + idx0], wg_base + idx0 < ${n}u);
      shared_vals[idx1] = select(${h}, output[base + wg_base + idx1], wg_base + idx1 < ${n}u);
${o?`
      shared_idx[idx0] = select(${n}, output_idx[base + wg_base + idx0], wg_base + idx0 < ${n}u);
      shared_idx[idx1] = select(${n}, output_idx[base + wg_base + idx1], wg_base + idx1 < ${n}u);`:``}
    }
    workgroupBarrier();

    let initial_stage = select(0u, ${p-1}u, uniforms.kind != 0u);
    for (var stage = initial_stage; stage < ${p}u; stage++) {
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
      ${o?`output_idx[base + wg_base + idx0] = shared_idx[idx0];`:``}
    }
    if (wg_base + idx1 < ${n}u) {
      output[base + wg_base + idx1] = shared_vals[idx1];
      ${o?`output_idx[base + wg_base + idx1] = shared_idx[idx1];`:``}
    }
  } else {
    // Execute single merge pass for a step >= numLocalStages.
    let half_block = 1u << uniforms.merge_step;  // half_block >= workgroupSize * 2
    let thread_in_batch = wg_in_batch * ${u} + tid;
    let is_first_step = uniforms.merge_step == uniforms.merge_stage;

    let block_offset = (thread_in_batch / half_block) * half_block;
    let local_offset = thread_in_batch % half_block;
    let i = block_offset * 2u + local_offset;
    let j = select(i + half_block, i ^ (half_block * 2u - 1u), is_first_step);

    // Global version of compare_and_swap()
    if (j < ${n}u) {
      let val_i = output[base + i];
      let val_j = output[base + j];
${o?`
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
`.trim(),_=E(a*d),v=[{kind:`sort`}];for(let e=p;e<f;e++)for(let t=e;t>=p-1;t--)v.push({kind:`merge`,mergeStep:t,mergeStage:e});return[{code:g,numInputs:1,numOutputs:o?2:1,hasUniform:!0,passes:v.map(e=>({grid:_,uniform:te(e)}))}]}function F(e,t){let n=t.inputDtypes[0],r=t.inputShapes[0],i=r[r.length-1];return P(e,n,i,a(r.slice(0,-1)),!1)}function I(e,t){let n=t.inputDtypes[0],r=t.inputShapes[0],i=r[r.length-1];return P(e,n,i,a(r.slice(0,-1)),!0)}function L(e,t,n){let i=t.inputDtypes[0],o=t.inputShapes[0],s=t.inputShapes[1],c=o[o.length-1],l=s[s.length-2],u=a(o.slice(0,-2)),d=i===`float16`,f=x(i,!0),p=r(c,e.limits.maxComputeWorkgroupSizeX);return[{code:`
${d?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> a: array<${f}>;
@group(0) @binding(1) var<storage, read> b: array<${f}>;
@group(0) @binding(2) var<storage, read_write> x: array<${f}>;

// Shared memory for the current pivot value x[j]
var<workgroup> x_j: ${f};

@compute @workgroup_size(${p})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let wg_idx = wg_id.x + wg_id.y * ${T}u;
  let mat_idx = wg_idx / ${l}u;
  let rhs_idx = wg_idx % ${l}u;

  if (mat_idx >= ${u}u) {
    return;
  }

  let a_base = mat_idx * ${c*c}u;
  let bx_base = (mat_idx * ${l}u + rhs_idx) * ${c}u;
  let tid = local_id.x;

  // Step 1: Copy b to x (threads collaborate)
  for (var idx = tid; idx < ${c}u; idx += ${p}u) {
    x[bx_base + idx] = b[bx_base + idx];
  }
  storageBarrier();

  // Step 2: Back-substitution from j = n-1 down to 0
  for (var jj = 0u; jj < ${c}u; jj++) {
    let j = ${c-1}u - jj;

    // Thread 0 computes x[j] = x[j] / a[j,j]
    if (tid == 0u) {
      ${n.unitDiagonal?`x_j = x[bx_base + j];`:`x_j = x[bx_base + j] / a[a_base + j * ${c}u + j];`}
      x[bx_base + j] = x_j;
    }
    workgroupBarrier();  // Sync shared memory x_j

    // All threads subtract x[j] * a[i,j] from x[i] for i < j
    for (var i = tid; i < j; i += ${p}u) {
      x[bx_base + i] -= x_j * a[a_base + i * ${c}u + j];
    }
    workgroupBarrier();
    storageBarrier();
  }
}
`.trim(),numInputs:2,numOutputs:1,hasUniform:!1,passes:[{grid:E(u*l)}]}]}function R(e,t){let n=t.inputDtypes[0],i=t.inputShapes[0],o=i[i.length-1],s=a(i.slice(0,-2)),c=n===`float16`,l=x(n,!0),u=r(o,e.limits.maxComputeWorkgroupSizeX);return[{code:`
${c?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input: array<${l}>;
@group(0) @binding(1) var<storage, read_write> output: array<${l}>;

// Shared memory for the diagonal element
var<workgroup> L_jj: ${l};

@compute @workgroup_size(${u})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let batch = wg_id.x + wg_id.y * ${T}u;
  if (batch >= ${s}u) {
    return;
  }

  let base = batch * ${o*o}u;
  let tid = local_id.x;

  // Zero out output and copy lower triangle from input (threads collaborate)
  for (var idx = tid; idx < ${o*o}u; idx += ${u}u) {
    let row = idx / ${o}u;
    let col = idx % ${o}u;
    output[base + idx] = select(0, input[base + idx], col <= row);
  }
  storageBarrier();

  // Cholesky-Crout algorithm: process column by column
  for (var j = 0u; j < ${o}u; j++) {
    // Step 1: All threads compute sum for their rows i >= j in parallel
    // sum = A[i][j] - sum(L[i][k] * L[j][k] for k < j)
    for (var i = j + tid; i < ${o}u; i += ${u}u) {
      var sum = output[base + i * ${o}u + j];
      for (var k = 0u; k < j; k++) {
        sum -= output[base + i * ${o}u + k] * output[base + j * ${o}u + k];
      }
      output[base + i * ${o}u + j] = sum;
    }
    storageBarrier();

    // Step 2: Thread 0 computes L[j][j] = sqrt(output[j][j])
    if (tid == 0u) {
      L_jj = sqrt(output[base + j * ${o}u + j]);
      output[base + j * ${o}u + j] = L_jj;
    }
    workgroupBarrier();

    // Step 3: All threads divide output[i][j] by L[j][j] for i > j
    for (var i = j + 1u + tid; i < ${o}u; i += ${u}u) {
      output[base + i * ${o}u + j] /= L_jj;
    }
    storageBarrier();
  }
}
`.trim(),numInputs:1,numOutputs:1,hasUniform:!1,passes:[{grid:E(s)}]}]}function z(e,t){let n=t.inputDtypes[0],i=t.inputShapes[0],o=i[i.length-2],s=i[i.length-1],c=Math.min(o,s),l=a(i.slice(0,-2)),u=n===`float16`,d=x(n,!0),f=r(Math.max(o,s),e.limits.maxComputeWorkgroupSizeX);return[{code:`
${u?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input: array<${d}>;
@group(0) @binding(1) var<storage, read_write> lu: array<${d}>;
@group(0) @binding(2) var<storage, read_write> pivots: array<i32>;
@group(0) @binding(3) var<storage, read_write> perm: array<i32>;

var<workgroup> pivot_row: u32;
var<workgroup> pivot_val: ${d};

@compute @workgroup_size(${f})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let batch = wg_id.x + wg_id.y * ${T}u;
  if (batch >= ${l}u) {
    return;
  }

  let lu_base = batch * ${o*s}u;
  let piv_base = batch * ${c}u;
  let perm_base = batch * ${o}u;
  let tid = local_id.x;

  // Copy input to lu
  for (var idx = tid; idx < ${o*s}u; idx += ${f}u) {
    lu[lu_base + idx] = input[lu_base + idx];
  }
  // Initialize permutation
  for (var idx = tid; idx < ${o}u; idx += ${f}u) {
    perm[perm_base + idx] = i32(idx);
  }
  storageBarrier();

  // LU decomposition with partial pivoting
  for (var j = 0u; j < ${c}u; j++) {
    // Step 1: Thread 0 finds pivot (max abs value in column j, rows >= j)
    if (tid == 0u) {
      var max_val = abs(lu[lu_base + j * ${s}u + j]);
      var max_row = j;
      for (var i = j + 1u; i < ${o}u; i++) {
        let val = abs(lu[lu_base + i * ${s}u + j]);
        if (val > max_val) {
          max_val = val;
          max_row = i;
        }
      }
      pivot_row = max_row;
      pivot_val = lu[lu_base + max_row * ${s}u + j];
      pivots[piv_base + j] = i32(max_row);
    }
    workgroupBarrier();

    // Step 2: Swap rows j and pivot_row (threads collaborate)
    let pr = pivot_row;
    if (pr != j) {
      for (var col = tid; col < ${s}u; col += ${f}u) {
        let tmp = lu[lu_base + j * ${s}u + col];
        lu[lu_base + j * ${s}u + col] = lu[lu_base + pr * ${s}u + col];
        lu[lu_base + pr * ${s}u + col] = tmp;
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
    for (var i = j + 1u + tid; i < ${o}u; i += ${f}u) {
      let factor = lu[lu_base + i * ${s}u + j] / pivot_val;
      lu[lu_base + i * ${s}u + j] = factor; // L[i][j]
      for (var k = j + 1u; k < ${s}u; k++) {
        lu[lu_base + i * ${s}u + k] -= factor * lu[lu_base + j * ${s}u + k];
      }
    }
    storageBarrier();
  }
}
`.trim(),numInputs:1,numOutputs:3,hasUniform:!1,passes:[{grid:E(l)}]}]}function B(e,t,n){let i=t.inputDtypes[0],o=t.inputShapes[0],s=o[o.length-1],c=a(o.slice(0,-2)),l=i===`float16`,u=x(i,!0),d=`${u}(${n.tolerance})`,f=r(Math.max(s,1),e.limits.maxComputeWorkgroupSizeX);return[{code:`
${l?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input: array<${u}>;
@group(0) @binding(1) var<storage, read_write> diagonalized: array<${u}>;
@group(0) @binding(2) var<storage, read_write> vectors: array<${u}>;

var<workgroup> done: u32;
var<workgroup> rot_active: u32;
var<workgroup> rot_c: ${u};
var<workgroup> rot_s: ${u};
var<workgroup> rot_app: ${u};
var<workgroup> rot_aqq: ${u};
var<workgroup> rot_apq: ${u};

fn mat_idx(base: u32, row: u32, col: u32) -> u32 {
  return base + row * ${s}u + col;
}

fn sym_idx(base: u32, row: u32, col: u32) -> u32 {
  return mat_idx(base, max(row, col), min(row, col));
}

@compute @workgroup_size(${f})
fn main(
  @builtin(workgroup_id) wg_id: vec3<u32>,
  @builtin(local_invocation_id) local_id: vec3<u32>,
) {
  let batch = wg_id.x + wg_id.y * ${T}u;
  if (batch >= ${c}u) {
    return;
  }

  let base = batch * ${s*s}u;
  let tid = local_id.x;

  for (var idx = tid; idx < ${s*s}u; idx += ${f}u) {
    let row = idx / ${s}u;
    let col = idx % ${s}u;
    diagonalized[base + idx] = select(
      ${u}(0),
      input[base + idx],
      row >= col,
    );
    vectors[base + idx] = select(${u}(0), ${u}(1), row == col);
  }
  storageBarrier();

  for (var sweep = 0u; sweep < ${n.maxSweeps}u; sweep++) {
    if (tid == 0u) {
      var max_abs = ${u}(1);
      var max_offdiag = ${u}(0);
      for (var idx = 0u; idx < ${s*s}u; idx++) {
        let row = idx / ${s}u;
        let col = idx % ${s}u;
        let value = abs(diagonalized[base + idx]);
        max_abs = max(max_abs, value);
        if (row > col) {
          max_offdiag = max(max_offdiag, value);
        }
      }
      done = select(0u, 1u, max_offdiag <= ${d} * max_abs);
    }
    let done_uniform = workgroupUniformLoad(&done);
    if (done_uniform != 0u) {
      break;
    }

    for (var p = 0u; p + 1u < ${s}u; p++) {
      for (var q = p + 1u; q < ${s}u; q++) {
        if (tid == 0u) {
          rot_app = diagonalized[mat_idx(base, p, p)];
          rot_aqq = diagonalized[mat_idx(base, q, q)];
          rot_apq = diagonalized[sym_idx(base, p, q)];
          if (rot_apq == ${u}(0)) {
            rot_active = 0u;
            rot_c = ${u}(1);
            rot_s = ${u}(0);
          } else {
            let tau = (rot_aqq - rot_app) / (${u}(2) * rot_apq);
            let tau_sign = select(${u}(-1), ${u}(1), tau >= ${u}(0));
            let t = tau_sign / (abs(tau) + sqrt(tau * tau + ${u}(1)));
            rot_c = inverseSqrt(t * t + ${u}(1));
            rot_s = t * rot_c;
            rot_active = 1u;
          }
        }
        workgroupBarrier();

        if (rot_active != 0u) {
          for (var k = tid; k < ${s}u; k += ${f}u) {
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
                rot_c * rot_c * rot_app - ${u}(2) * rot_s * rot_c * rot_apq + rot_s * rot_s * rot_aqq;
              diagonalized[sym_idx(base, p, q)] = ${u}(0);
            } else {
              diagonalized[mat_idx(base, q, q)] =
                rot_s * rot_s * rot_app + ${u}(2) * rot_s * rot_c * rot_apq + rot_c * rot_c * rot_aqq;
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
`.trim(),numInputs:1,numOutputs:2,hasUniform:!1,passes:[{grid:E(c)}]}]}function V(e,t,n,r){return new Uint8Array(new Uint32Array([e,t,n,+!!r]).buffer)}function H(e,t,n){let i=t.inputDtypes[0],o=t.inputShapes[0],s=o[o.length-1],c=a(o.slice(0,-1));if(a(n.factors)!==s)throw Error(`fft: factorization ${n.factors} does not match size ${s}`);let l=i===`float16`,u=x(i,!0),d=Math.min(256,r(0,e.limits.maxComputeWorkgroupSizeX)),f=Math.max(1,...n.factors),p=n.inverse?`6.283185307179586`:`-6.283185307179586`,m=n.factors.map(e=>`
  digit = remaining % ${e}u;
  remaining = remaining / ${e}u;
  stride = stride * ${e}u;
  reversed = reversed + digit * (${s}u / stride);`).join(``),h=`
${l?`enable f16;`:``}
${y}

@group(0) @binding(0) var<storage, read> input_real: array<${u}>;
@group(0) @binding(1) var<storage, read> input_imag: array<${u}>;
@group(0) @binding(2) var<storage, read_write> output_real: array<${u}>;
@group(0) @binding(3) var<storage, read_write> output_imag: array<${u}>;

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
${m}
  return reversed;
}

@compute @workgroup_size(${d})
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let global = global_id.x + global_id.y * ${T*d}u;

  if (fft_params.phase == 0u) {
    if (global >= ${c*s}u) {
      return;
    }
    let batch = global / ${s}u;
    let out_idx = global % ${s}u;
    let source = batch * ${s}u + digit_reversed_index(out_idx);
    output_real[global] = input_real[source];
    output_imag[global] = input_imag[source];
    return;
  }

  let butterflies_per_batch = ${s}u / fft_params.radix;
  if (global >= ${c}u * butterflies_per_batch) {
    return;
  }

  let batch = global / butterflies_per_batch;
  let local = global % butterflies_per_batch;
  let j = local % fft_params.prev;
  let group = local / fft_params.prev;
  let span = fft_params.prev * fft_params.radix;
  let start = batch * ${s}u + group * span + j;
  let scale = select(1.0, 1.0 / f32(${s}u), fft_params.normalize != 0u);

  var scratch_real: array<f32, ${f}>;
  var scratch_imag: array<f32, ${f}>;

  for (var q = 0u; q < fft_params.radix; q++) {
    let idx = start + q * fft_params.prev;
    let angle = ${p} * f32(q * j) / f32(span);
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
      let angle = ${p} * f32(q * p) / f32(fft_params.radix);
      let c = cos(angle);
      let s = sin(angle);
      let xr = scratch_real[q];
      let xi = scratch_imag[q];
      sum_real += xr * c - xi * s;
      sum_imag += xr * s + xi * c;
    }
    let idx = start + p * fft_params.prev;
    output_real[idx] = ${u}(sum_real * scale);
    output_imag[idx] = ${u}(sum_imag * scale);
  }
}
`.trim(),g=[{grid:E(Math.ceil(c*s/d)),uniform:V(0,1,1,!1)}],_=1;for(let e=0;e<n.factors.length;e++){let t=n.factors[e];g.push({grid:E(Math.ceil(c*s/t/d)),uniform:V(1,t,_,n.inverse&&e===n.factors.length-1)}),_*=t}return[{code:h,numInputs:2,numOutputs:2,hasUniform:!0,passes:g}]}function U(e,t){switch(t.name){case`Sort`:return F(e,t.type);case`Argsort`:return I(e,t.type);case`TriangularSolve`:return L(e,t.type,t.params);case`Cholesky`:return R(e,t.type);case`LU`:return z(e,t.type);case`JacobiEigh`:return B(e,t.type,t.params);case`Fft`:return H(e,t.type,t.params);default:throw new c(t.name,`webgpu`)}}const W=4096,G=new WeakMap;function K(e){return{querySet:e.createQuerySet({type:`timestamp`,count:W}),resolve:e.createBuffer({size:W*8,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}),dst:e.createBuffer({size:W*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),nextIndex:0,entries:[]}}function q(e){if(!e.features.has(`timestamp-query`))return;let t=G.get(e);t&&t.nextIndex>=W&&(Z(e,t),t=void 0),t||(t=K(e),G.set(e,t),o(()=>{let t=G.get(e);t&&t.entries.length>0&&Z(e,t),G.delete(e)}));let n=t.nextIndex,r=n+1;return t.nextIndex+=2,{batch:t,beginIndex:n,endIndex:r}}function J(e){if(f())return q(e)}function Y(e,t,n,r,i){let a=v(n);a.properties.push([`passes`,`${r}`]),a.properties.push([`source`,i]),t.batch.entries.push({...a,beginIndex:t.beginIndex,endIndex:t.endIndex}),X(e)}function X(e){queueMicrotask(()=>{let t=G.get(e);t&&t.entries.length>0&&(Z(e,t),G.set(e,K(e)))})}function Z(e,t){if(t.entries.length===0)return;let n=t.nextIndex,r=e.createCommandEncoder();r.resolveQuerySet(t.querySet,0,n,t.resolve,0),r.copyBufferToBuffer(t.resolve,0,t.dst,0,n*8),e.queue.submit([r.finish()]);let{entries:i}=t;t.dst.mapAsync(GPUMapMode.READ).then(()=>{try{let e=new BigInt64Array(t.dst.getMappedRange()),n=e[i[i.length-1].endIndex],r=performance.now();for(let t of i)h(`webgpu`,t,r+Number(e[t.beginIndex]-n)/1e6,r+Number(e[t.endIndex]-n)/1e6)}finally{t.dst.unmap(),t.querySet.destroy(),t.resolve.destroy(),t.dst.destroy()}})}const Q=64*1024*1024;var ne=class{device;type=`webgpu`;maxArgs;pipelines;syncReader;buffers;nextSlot;#e=new Map;#t;#n=new Map;constructor(e){this.device=e,s>=3&&e.adapterInfo&&console.info(`webgpu adapter:`,e.adapterInfo.vendor,e.adapterInfo.architecture),this.maxArgs=this.device.limits.maxStorageBuffersPerShaderStage-1,this.pipelines=new oe(e),this.syncReader=new N(e),this.buffers=new Map,this.nextSlot=1,this.#t=this.#s(4),e.addEventListener(`uncapturederror`,e=>{console.error(`Uncaptured error in WebGPU backend:`,e.error.message)})}malloc(e,t){if(t&&t.byteLength!==e)throw Error(`initialData size does not match buffer size`);let n=Math.ceil(e/4)*4||4,r=e===0?this.#t:this.#a(n);if(t&&e>0)if(t.byteLength%4==0)this.device.queue.writeBuffer(r,0,t);else{let e=t.byteLength-t.byteLength%4;e>0&&this.device.queue.writeBuffer(r,0,t,0,e);let n=new Uint8Array(4);n.set(t.subarray(e)),this.device.queue.writeBuffer(r,e,n)}let i=this.nextSlot++;return this.buffers.set(i,{buffer:r,size:e,allocatedSize:n,ref:1}),i}incRef(e){let t=this.buffers.get(e);if(!t)throw new m(e);t.ref++}decRef(e){let t=this.buffers.get(e);if(!t)throw new m(e);t.ref--,t.ref===0&&(this.buffers.delete(e),t.buffer!==this.#t&&this.#o(t.buffer,t.allocatedSize))}async read(e,t,n){let{buffer:r,size:i}=this.#i(e);if(r===this.#t)return new Uint8Array;t===void 0&&(t=0),n===void 0&&(n=i-t);let a=Math.ceil(n/4)*4,o=this.#s(a,{read:!0});try{let e=this.device.createCommandEncoder();e.copyBufferToBuffer(r,t,o,0,a),this.device.queue.submit([e.finish()]),await o.mapAsync(GPUMapMode.READ);let i=o.getMappedRange();return new Uint8Array(i.slice(),0,n)}finally{o.destroy()}}readSync(e,t,n){let{buffer:r,size:i}=this.#i(e);return r===this.#t?new Uint8Array:(t===void 0&&(t=0),n===void 0&&(n=i-t),this.syncReader.read(r,t,n))}#r(e){let t=d.hash(e),n=this.#e.get(t);return n||(n=re(this.device,e),this.#e.set(t,n)),n}async prepareKernel(e){let n=this.#r(e),r=await this.pipelines.prepare(n);return new t(e,[{...n,pipeline:r}])}prepareKernelSync(e){let n=this.#r(e),r=this.pipelines.prepareSync(n);return new t(e,[{...n,pipeline:r}])}async prepareRoutine(e){let n=U(this.device,e);return new t(e,await Promise.all(n.map(async e=>{let t=await this.pipelines.prepare(e);return{...e,pipeline:t}})))}prepareRoutineSync(e){return new t(e,U(this.device,e).map(e=>{let t=this.pipelines.prepareSync(e);return{...e,pipeline:t}}))}dispatch(e,t,n){let r=t.map(e=>this.#i(e).buffer),i=n.map(e=>this.#i(e).buffer);ie(this.device,e,r,i)}#i(e){let t=this.buffers.get(e);if(!t)throw new m(e);return{buffer:t.buffer,size:t.size}}#a(e){if(e>Q)return this.#s(e);let t=this.#n.get(e),n=t?.pop();return t&&t.length===0&&this.#n.delete(e),n??this.#s(e)}#o(e,t){if(t>Q){e.destroy();return}let n=this.#n.get(t);if(!n){this.#n.set(t,[e]);return}if(n.length>=64){e.destroy();return}n.push(e)}#s(e,{mapped:t=!1,read:n=!1}={}){if(n&&t)throw Error(`mapped and read cannot both be true`);return this.device.createBuffer({size:e,usage:n?GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST,mappedAtCreation:t})}};function re(e,t){let n=M(e,t);if(n)return n;let i=_(t);s>=3&&console.info(`kernel.exp: ${t.exp}\ntune.exp: ${i.exp}`);let{nargs:a,reduction:o}=t,c=Array.from({length:a},(e,t)=>`in${t}`),l=new b;l.emitPreamble(e,[i.exp,i.epilogue]);let d=Array.from({length:a},()=>null);i.exp.fold(e=>{e.op===`GlobalIndex`&&(d[e.arg[0]]=e.dtype)}),i.epilogue?.fold(e=>{e.op===`GlobalIndex`&&(d[e.arg[0]]=e.dtype)});for(let e=0;e<a;e++){let t=x(d[e]??`float32`,!0);l.emit(`@group(0) @binding(${e}) var<storage, read> ${c[e]} : array<${t}>;`)}let f=x(t.dtype,!0);l.emit(`@group(0) @binding(${a}) var<storage, read_write> result : array<${f}>;`);let p=o?i.size.groups??1:1,m=o&&p>1;if(m&&i.threadCount%p!==0)throw Error(`WebGPU grouped reduction has invalid thread count`);if(m&&p>e.limits.maxComputeWorkgroupSizeX)throw Error(`WebGPU grouped reduction exceeds workgroup size limit`);let h=m?p:r(i.threadCount,256),v=m?i.threadCount/p:Math.ceil(i.threadCount/h),[y,S]=E(v);if(m){let e=x(o.dtype);for(let t=0;t<(i.size.upcast??1);t++)l.emit(`var<workgroup> partial${t}: array<${e}, ${p}>;`)}if(l.emit(``,`@compute @workgroup_size(${h})`),m)l.emit(`fn main(`,l.pushIndent,`@builtin(local_invocation_id) lid : vec3<u32>,`,`@builtin(workgroup_id) wg_id : vec3<u32>,`,l.popIndent,`) {`,l.pushIndent),S===1?l.emit(`if (wg_id.x >= ${v}u) { return; }`,`let gidx: i32 = i32(wg_id.x);`):l.emit(`if (${y}u * wg_id.y + wg_id.x >= ${v}u) { return; }`,`let gidx: i32 = i32(${y}u * wg_id.y + wg_id.x);`),l.emit(`let group: i32 = i32(lid.x);`);else if(l.emit(`fn main(@builtin(global_invocation_id) id : vec3<u32>) {`,l.pushIndent),S===1)l.emit(`if (id.x >= ${i.threadCount}) { return; }`,`let gidx: i32 = i32(id.x);`);else{let e=y*h;l.emit(`if (${e} * id.y + id.x >= ${i.threadCount}) { return; }`,`let gidx: i32 = i32(${e} * id.y + id.x);`)}l.emitPhonyAssignments(c);let T=new w(l,c);if(o){let e=i.size.unroll??1,t=i.size.upcast??1,n=[...Array(t)].map((e,t)=>`acc${t}`);for(let e=0;e<t;e++)l.emit(`var ${n[e]}: ${x(o.dtype)} = ${C(o.dtype,o.identity)};`);l.emit(`for (var ridx: i32 = 0; ridx < ${i.size.reduce}; ridx++) {`,l.pushIndent);let r=[],a=new Map;for(let n=0;n<t;n++){r.push([]);for(let t=0;t<e;t++){let e=i.exp.substitute({upcast:u.i32(n),unroll:u.i32(t)});r[n].push(e.simplify(a)),T.countReferences(r[n][t])}}let s=r.map(e=>e.map(e=>T.run(e)).map(g));for(let r=0;r<t;r++){let t=s[r][0];for(let n=1;n<e;n++)if(o.op===`Add`)t=`${t} + ${s[r][n]}`;else if(o.op===`Mul`)t=`${t} * ${s[r][n]}`;else if(o.op===`Min`)t=o.dtype===`bool`?`(${t} && ${s[r][n]})`:`min(${t}, ${s[r][n]})`;else if(o.op===`Max`)t=o.dtype===`bool`?`(${t} || ${s[r][n]})`:`max(${t}, ${s[r][n]})`;else throw Error(`Unsupported reduction op: ${o.op}`);if(o.op===`Add`)l.emit(`${n[r]} += ${t};`);else if(o.op===`Mul`)l.emit(`${n[r]} *= ${t};`);else if(o.op===`Min`)o.dtype===`bool`?l.emit(`${n[r]} = ${n[r]} && ${t};`):l.emit(`${n[r]} = min(${n[r]}, ${t});`);else if(o.op===`Max`)o.dtype===`bool`?l.emit(`${n[r]} = ${n[r]} || ${t};`):l.emit(`${n[r]} = max(${n[r]}, ${t});`);else throw Error(`Unsupported reduction op: ${o.op}`)}if(l.emit(l.popIndent,`}`),m){for(let e=0;e<t;e++)l.emit(`partial${e}[lid.x] = ${n[e]};`);l.emit(`workgroupBarrier();`);for(let e=p/2;e>=1;e/=2){l.emit(`if (lid.x < ${e}u) {`,l.pushIndent);for(let n=0;n<t;n++)l.emit(`partial${n}[lid.x] = ${ee(o.op,o.dtype,`partial${n}[lid.x]`,`partial${n}[lid.x + ${e}u]`)};`);l.emit(l.popIndent,`}`,`workgroupBarrier();`)}}T.reset();let c=[],d=[];for(let e=0;e<t;e++){let t=i.outputIdxExp.substitute({upcast:u.i32(e)});c.push(t.simplify(a)),T.countReferences(c[e]),d.push(i.epilogue.substitute({acc:u.variable(o.dtype,n[e]),upcast:u.i32(e)}).simplify(a)),T.countReferences(d[e])}if(m){l.emit(`if (lid.x == 0u) {`,l.pushIndent);for(let e=0;e<t;e++)l.emit(`${n[e]} = partial${e}[0u];`)}for(let e=0;e<t;e++){let t=g(T.run(c[e])),n=g(T.run(d[e]));f!==x(d[e].dtype)&&(n=`${f}(${n})`),l.emit(`result[${t}] = ${n};`)}m&&l.emit(l.popIndent,`}`)}else{T.countReferences(i.exp);let e=g(T.run(i.exp));f!==x(i.exp.dtype)&&(e=`${f}(${e})`),l.emit(`result[gidx] = ${e};`)}return l.emit(l.popIndent,`}`),{code:l.toString(),numInputs:a,numOutputs:1,hasUniform:!1,passes:[{grid:[y,S]}]}}function ie(e,t,n,r){let{data:i,source:o}=t,s=e.createCommandEncoder();for(let{pipeline:t,...c}of i){if(n.length!==c.numInputs||r.length!==c.numOutputs)throw Error(`webgpu: expected ${c.numInputs} inputs and ${c.numOutputs} outputs, got ${n.length} inputs and ${r.length} outputs`);let i=c.passes.filter(({grid:e})=>a(e)>0);if(i.length===0)continue;let l=J(e),u=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[...n.map((e,t)=>({binding:t,resource:{buffer:e}})),...r.map((e,t)=>({binding:n.length+t,resource:{buffer:e}}))]}),d=null,f=0;if(c.hasUniform){let[n,r]=ae(e,i.map(({uniform:e})=>e));f=r,d=e.createBindGroup({layout:t.getBindGroupLayout(1),entries:[{binding:0,resource:{buffer:n,size:r}}]})}for(let e=0;e<i.length;e++){let{grid:n}=i[e],r;if(l){let t=e===0,n=e===i.length-1;(t||n)&&(r={querySet:l.batch.querySet,...t?{beginningOfPassWriteIndex:l.beginIndex}:{},...n?{endOfPassWriteIndex:l.endIndex}:{}})}let a=s.beginComputePass({timestampWrites:r});a.setPipeline(t),a.setBindGroup(0,u),d&&a.setBindGroup(1,d,[e*f]),a.dispatchWorkgroups(n[0],n[1]),a.end()}l&&Y(e,l,o,i.length,c.code)}e.queue.submit([s.finish()])}function ae(e,t){for(let e of t)if(!e||e.byteLength===0||e.byteLength!==t[0].byteLength)throw Error(`webgpu: Uniform mismatch between shader passes`);let n=e.limits.minUniformBufferOffsetAlignment,r=Math.ceil(t[0].byteLength/n)*n,i=e.createBuffer({size:r*t.length,usage:GPUBufferUsage.UNIFORM,mappedAtCreation:!0}),a=new Uint8Array(i.getMappedRange());for(let e=0;e<t.length;e++)a.set(t[e],e*r);return i.unmap(),[i,r]}var oe=class{device;cache;inProgress;constructor(e){this.device=e,this.cache=new Map,this.inProgress=new Map}#e(t){if(t.numInputs+t.numOutputs>this.device.limits.maxStorageBuffersPerShaderStage){let e=t.numInputs+t.numOutputs,n=this.device.limits.maxStorageBuffersPerShaderStage;throw Error(`Too many buffers (${e}) for WebGPU pipeline (max: ${n})`)}let n=[this.device.createBindGroupLayout({entries:e(t.numInputs+t.numOutputs).map(e=>({binding:e,visibility:GPUShaderStage.COMPUTE,buffer:{type:e<t.numInputs?`read-only-storage`:`storage`}}))})];return t.hasUniform&&n.push(this.device.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:`uniform`,hasDynamicOffset:!0}}]})),this.device.createPipelineLayout({bindGroupLayouts:n})}async prepare(e){let t=this.cache.get(e.code);if(t)return t;let n=this.inProgress.get(e.code);if(n)return await n;s>=2&&console.info(`=========== WebGPU shader ===========
`+e.code);let r=this.device.createShaderModule({code:e.code}),i=(async()=>{this.device.pushErrorScope(`validation`);try{let t=await this.device.createComputePipelineAsync({layout:this.#e(e),compute:{module:r,entryPoint:`main`}});return await this.device.popErrorScope(),t}catch{let t=await $(r,await this.device.popErrorScope(),e.code);throw Error(t)}})();this.inProgress.set(e.code,i);let a=await i;return this.cache.set(e.code,a),a}prepareSync(e){let t=this.cache.get(e.code);if(t)return t;s>=2&&console.info(`=========== WebGPU shader ===========
`+e.code);let n=this.device.createShaderModule({code:e.code});this.device.pushErrorScope(`validation`);let r=this.device.createComputePipeline({layout:this.#e(e),compute:{module:n,entryPoint:`main`}});return this.device.popErrorScope().then(async t=>{if(t!==null){let r=await $(n,t,e.code);console.error(r)}}),this.cache.set(e.code,r),r}};async function $(e,t,n){let r=`Failed to compile shader: ${t?t.message:`(no error scope)`}`,i=await e.getCompilationInfo();for(let e of i.messages)r+=`\n  [${e.type} at ${e.lineNum}:${e.linePos}] ${e.message}`;return n&&(r+=`\n\n${n}`),r}export{ne as WebGPUBackend};