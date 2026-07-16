/* Nootropix — Molecule Hero engine (raymarched SDF Phenibut, WebGL2)
   Consumed by sections/hero-molecule.liquid. One canvas per section instance.
   Boot strategy: text + CSS fallback paint first (LCP-safe); WebGL starts after
   load + idle, then the canvas fades in. Static fallback on: no WebGL2,
   prefers-reduced-motion handled inside (single frame), saveData, or <=2GB RAM. */
(function(){
  'use strict';

  function num(v, d){ var n = parseFloat(v); return isNaN(n) ? d : n; }

  function engine(root, cfg){

  const hero = root;
  const canvas = root.querySelector('.hm-canvas');
  if(!canvas) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const gl = canvas.getContext('webgl2', {alpha:true, antialias:false, depth:false, stencil:false, powerPreference:'high-performance', premultipliedAlpha:true});
  if(!gl){ hero.classList.add('static'); return; }

  // ---- quality tier
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || Math.min(screen.width,screen.height) < 520;
  const TIER = isMobile
    ? { MARCH:70,  SHADOW:16, REF:8,  AO:4, SCALE:0.62, DPR:1.0 }
    : { MARCH:110, SHADOW:26, REF:20, AO:5, SCALE:1.0,  DPR:Math.min(devicePixelRatio,1.6) };

  // ================= shaders =================
  const VS = `#version 300 es
  in vec2 p; void main(){ gl_Position = vec4(p,0.0,1.0); }`;

  const FS = `#version 300 es
  precision highp float;
  out vec4 O;
  uniform vec2  uRes;
  uniform vec2  uRot;   // yaw, pitch
  uniform vec2  uOff;   // screen-space offset: molecule renders at uv==uOff, clear of the text column
  uniform float uDist;  // camera distance (responsive: further back = smaller molecule = safe margins)

  #define NA 13
  #define IOR 1.46
  #define ABSORB 0.55
  const vec3 CENTER = vec3(0.35, 0.02, 0.30);

  const vec3 A[NA] = vec3[NA](
    vec3(-0.40, 0.10, 0.00), // 0  ring (attach)
    vec3(-1.10, 1.31, 0.00), // 1  ring
    vec3(-2.50, 1.31, 0.00), // 2  ring
    vec3(-3.20, 0.10, 0.00), // 3  ring
    vec3(-2.50,-1.11, 0.00), // 4  ring
    vec3(-1.10,-1.31, 0.00), // 5  ring
    vec3( 0.90, 0.20, 0.30), // 6  Cbeta (phenyl-bearing)
    vec3( 1.70, 1.25,-0.10), // 7  CH2 -> acid
    vec3( 3.00, 1.15, 0.20), // 8  carboxyl C
    vec3( 3.70, 2.15, 0.40), // 9  =O
    vec3( 3.60,-0.00, 0.10), // 10 -OH
    vec3( 1.30,-1.00, 1.00), // 11 CH2 -> amine
    vec3( 2.50,-1.40, 1.70)  // 12 N (amino)
  );
  const float RAD[NA] = float[NA](
    0.50,0.50,0.50,0.50,0.50,0.50, // ring C
    0.52,0.50,0.50,               // chain C
    0.54,0.54,                    // O
    0.50,                         // CH2
    0.55                          // N
  );
  // glass tint (color light picks up) per atom
  const vec3 COL[NA] = vec3[NA](
    vec3(0.62,0.74,1.00),vec3(0.62,0.74,1.00),vec3(0.62,0.74,1.00),
    vec3(0.62,0.74,1.00),vec3(0.62,0.74,1.00),vec3(0.62,0.74,1.00),
    vec3(0.58,0.70,1.00),vec3(0.58,0.70,1.00),vec3(0.55,0.66,1.00),
    vec3(1.00,0.40,0.28),vec3(1.00,0.40,0.28),               // O -> label-red accent
    vec3(0.58,0.70,1.00),
    vec3(0.36,0.42,1.00)                                     // N -> deep bottle indigo
  );

  float smin(float a,float b,float k){ float h=clamp(0.5+0.5*(b-a)/k,0.0,1.0); return mix(b,a,h)-k*h*(1.0-h); }
  float sdCap(vec3 p,vec3 a,vec3 b,float r){ vec3 pa=p-a,ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0); return length(pa-ba*h)-r; }

  float bonds(vec3 q){
    float r=0.15; float d=1e5;
    d=min(d,sdCap(q,A[0],A[1],r)); d=min(d,sdCap(q,A[1],A[2],r));
    d=min(d,sdCap(q,A[2],A[3],r)); d=min(d,sdCap(q,A[3],A[4],r));
    d=min(d,sdCap(q,A[4],A[5],r)); d=min(d,sdCap(q,A[5],A[0],r));
    d=min(d,sdCap(q,A[0],A[6],r)); d=min(d,sdCap(q,A[6],A[7],r));
    d=min(d,sdCap(q,A[7],A[8],r)); d=min(d,sdCap(q,A[8],A[9],r));
    d=min(d,sdCap(q,A[8],A[10],r)); d=min(d,sdCap(q,A[6],A[11],r));
    d=min(d,sdCap(q,A[11],A[12],r));
    return d;
  }

  float map(vec3 p){
    vec3 q=p+CENTER;
    float d=1e5;
    for(int i=0;i<NA;i++){ d=smin(d, length(q-A[i])-RAD[i], 0.28); }
    d=min(d, bonds(q));
    return d*0.9;
  }

  vec3 matAt(vec3 p){
    vec3 q=p+CENTER; vec3 c=vec3(0.0); float w=0.0;
    for(int i=0;i<NA;i++){ float ww=exp(-length(q-A[i])*2.6); c+=COL[i]*ww; w+=ww; }
    return c/max(w,1e-3);
  }

  vec3 calcN(vec3 p){
    vec2 e=vec2(0.0016,0.0);
    return normalize(vec3(
      map(p+e.xyy)-map(p-e.xyy),
      map(p+e.yxy)-map(p-e.yxy),
      map(p+e.yyx)-map(p-e.yyx)));
  }

  // studio environment matched to the bottle photography: white key, indigo fill, faint warm kiss
  vec3 env(vec3 rd){
    vec3 base = mix(vec3(0.018,0.018,0.026), vec3(0.040,0.042,0.058), rd.y*0.5+0.5);
    float key = pow(max(dot(rd, normalize(vec3(0.55,0.65,0.45))),0.0), 28.0);
    float key2= pow(max(dot(rd, normalize(vec3(0.55,0.65,0.45))),0.0), 4.0);
    float rim = pow(max(dot(rd, normalize(vec3(-0.7,0.15,0.35))),0.0), 6.0);
    base += vec3(0.98,0.98,1.00)*key*4.2;          // clean white softbox
    base += vec3(0.42,0.46,0.62)*key2*0.5;         // cool spill
    base += vec3(0.30,0.36,0.95)*rim*0.40;         // indigo rim (bottle blue)
    base += vec3(0.55,0.45,0.20)*pow(max(dot(rd,normalize(vec3(0.1,-0.3,0.9))),0.0),8.0)*0.18; // faint warm floor kiss
    return base;
  }

  float softShadow(vec3 ro, vec3 rd){
    float res=1.0, t=0.06;
    for(int i=0;i<${TIER.SHADOW};i++){
      float h=map(ro+rd*t);
      if(h<0.001) return 0.0;
      res=min(res, 14.0*h/t);
      t+=clamp(h,0.03,0.35);
      if(t>7.0) break;
    }
    return clamp(res,0.0,1.0);
  }
  float ao(vec3 p, vec3 n){
    float occ=0.0, sca=1.0;
    for(int i=0;i<${TIER.AO};i++){
      float hr=0.04+0.13*float(i);
      occ+=(hr-map(p+n*hr))*sca; sca*=0.82;
    }
    return clamp(1.0-1.6*occ,0.0,1.0);
  }

  vec3 shade(vec3 p, vec3 n, vec3 rd){
    vec3 tint = matAt(p);
    float fres = pow(1.0-max(dot(n,-rd),0.0),5.0); fres = 0.05 + 0.95*fres;
    vec3 refl = env(reflect(rd,n));

    // refraction: enter, march inside, exit
    vec3 rr = refract(rd,n,1.0/IOR);
    vec3 ip = p + rr*0.03; float tL=0.0;
    for(int i=0;i<${TIER.REF};i++){
      float d=map(ip);
      if(d>0.0) break;
      float st=max(-d,0.04); ip+=rr*st; tL+=st;
    }
    vec3 en = -calcN(ip);
    vec3 outDir = refract(rr,en,IOR);
    if(dot(outDir,outDir)<0.0001) outDir=reflect(rr,en); // total internal reflection
    vec3 refr = env(outDir);
    // Beer-Lambert absorption over internal path -> thick-glass amber depth
    vec3 absorb = exp(-tL * (vec3(1.0)-tint) * ABSORB);
    refr *= absorb;

    vec3 col = mix(refr, refl, fres);

    // subsurface glow on thin regions
    float sss = exp(-tL*0.9);
    col += tint * sss * 0.34;

    // key specular + soft shadow contact
    vec3 L = normalize(vec3(0.6,0.7,0.5));
    float sh = softShadow(p+n*0.02, L);
    vec3 hn = normalize(L-rd);
    col += vec3(0.98,0.98,1.00)*pow(max(dot(n,hn),0.0),96.0)*sh*1.35;

    // ambient occlusion + rim
    col *= (0.58+0.42*ao(p,n));
    col += vec3(0.62,0.70,1.00)*pow(fres,1.4)*0.42;
    return col;
  }

  mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0,-s, 0,1,0, s,0,c); }
  mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1,0,0, 0,c,-s, 0,s,c); }

  void main(){
    vec2 uv = (gl_FragCoord.xy - 0.5*uRes)/uRes.y - uOff;
    mat3 R = rotY(uRot.x)*rotX(uRot.y);
    vec3 ro = R*vec3(0.0,0.0,uDist);
    vec3 rd = R*normalize(vec3(uv*0.85, -1.0));

    float t=0.0; bool hit=false;
    for(int i=0;i<${TIER.MARCH};i++){
      vec3 pos=ro+rd*t;
      float d=map(pos);
      if(d<0.0015){ hit=true; break; }
      t+=d;
      if(t>16.0) break;
    }

    if(!hit){
      // Transparent miss so CSS fallback + ghost bottle read behind the molecule.
      // Env softbox bloom is compensated by the fallback radial in the section CSS.
      O = vec4(0.0);
      return;
    }

    vec3 pos=ro+rd*t;
    vec3 n=calcN(pos);
    vec3 col=shade(pos,n,rd);

    // tone map + vignette + dither
    col = 1.0 - exp(-col*1.25);
    col = pow(col, vec3(0.92));
    col *= 1.0 - dot(uv,uv)*0.24;   // uv is already offset-relative, so the vignette hugs the molecule
    col += (fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-0.5)/255.0;
    O = vec4(col,1.0);
  }`;

  // ================= compile =================
  function sh(type,src){ const s=gl.createShader(type); gl.shaderSource(s,src); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){ console.error(gl.getShaderInfoLog(s)); return null;} return s; }
  const vs=sh(gl.VERTEX_SHADER,VS), fs=sh(gl.FRAGMENT_SHADER,FS);
  if(!vs||!fs){ hero.classList.add('static'); return; }
  const prog=gl.createProgram(); gl.attachShader(prog,vs); gl.attachShader(prog,fs); gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){ hero.classList.add('static'); return; }
  gl.useProgram(prog);
  gl.clearColor(0,0,0,0);

  const buf=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

  const uRes=gl.getUniformLocation(prog,'uRes');
  const uRot=gl.getUniformLocation(prog,'uRot');
  const uOff=gl.getUniformLocation(prog,'uOff');
  // desktop: shift molecule right, into the empty 54%; mobile: shift it below the stacked text
  const uDist=gl.getUniformLocation(prog,'uDist');
  // [offX, offY, camDist] from section settings; mobile stacks text on top so molecule shifts down
  function offset(){
    return (hero.clientWidth<=760)
      ? [cfg.moffx, cfg.moffy, cfg.mdist]
      : [cfg.offx,  cfg.offy,  cfg.dist];
  }

  // ================= size =================
  let W=0,H=0;
  function resize(){
    const w=Math.max(1,Math.floor(hero.clientWidth*TIER.DPR*TIER.SCALE));
    const h=Math.max(1,Math.floor(hero.clientHeight*TIER.DPR*TIER.SCALE));
    if(w===W&&h===H) return;
    W=w;H=h;canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);
  }
  resize(); addEventListener('resize',resize);

  // ================= rotation state =================
  let yaw = 0.5, pitch = -0.15;
  let tgtYaw = yaw, tgtPitch = pitch;
  let dragging=false, lastX=0, lastY=0;

  canvas.addEventListener('pointerdown', e=>{ dragging=true; lastX=e.clientX; lastY=e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e=>{
    if(!dragging) return;
    tgtYaw   += (e.clientX-lastX)*0.006;
    tgtPitch += (e.clientY-lastY)*0.006;
    tgtPitch = Math.max(-1.2, Math.min(1.2, tgtPitch));
    lastX=e.clientX; lastY=e.clientY;
  });
  addEventListener('pointerup', ()=>dragging=false);
  // hover parallax when not dragging
  canvas.addEventListener('pointermove', e=>{
    if(dragging) return;
    const r=canvas.getBoundingClientRect();
    tgtYaw   = 0.5 + ((e.clientX-r.left)/r.width  - 0.5)*0.9;
    tgtPitch = -0.15 + ((e.clientY-r.top)/r.height - 0.5)*0.6;
  });
  // scroll adds spin
  let scrollSpin=0;
  if(!reduced){
    addEventListener('scroll', ()=>{ scrollSpin = window.scrollY*0.0015; }, {passive:true});
  }

  // ================= render loop =================
  let running=false, autospin=0;
  function draw(){
    if(!running && !reduced) return;
    resize();
    if(!reduced){
      autospin += cfg.spin;
      yaw   += (tgtYaw + autospin + scrollSpin - yaw)*0.06;
      pitch += (tgtPitch - pitch)*0.06;
    } else {
      yaw=tgtYaw; pitch=tgtPitch;
    }
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes,W,H);
    gl.uniform2f(uRot,yaw,pitch); const o=offset(); gl.uniform2f(uOff,o[0],o[1]); gl.uniform1f(uDist,o[2]);
    gl.drawArrays(gl.TRIANGLES,0,3);
    reveal();
    if(!reduced) requestAnimationFrame(draw);
  }

  let shown=false;
  function reveal(){ if(!shown){ shown=true; canvas.classList.add('on'); } }
  if(reduced){
    // strict: single static frame, still drag/hover updates on demand
    resize(); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform2f(uRes,W,H); gl.uniform2f(uRot,yaw,pitch); const o=offset(); gl.uniform2f(uOff,o[0],o[1]); gl.uniform1f(uDist,o[2]); gl.drawArrays(gl.TRIANGLES,0,3); reveal();
    const redraw=()=>{ resize(); yaw+=(tgtYaw-yaw)*0.2; pitch+=(tgtPitch-pitch)*0.2;
      gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform2f(uRes,W,H); gl.uniform2f(uRot,yaw,pitch); const o=offset(); gl.uniform2f(uOff,o[0],o[1]); gl.uniform1f(uDist,o[2]); gl.drawArrays(gl.TRIANGLES,0,3); };
    canvas.addEventListener('pointermove', redraw);
  } else {
    new IntersectionObserver(es=>{
      const vis = es[0].isIntersecting && !document.hidden;
      if(vis && !running){ running=true; requestAnimationFrame(draw); }
      else running=vis;
    }).observe(hero);
    document.addEventListener('visibilitychange', ()=>{
      if(!document.hidden && !running){ running=true; requestAnimationFrame(draw); }
    });
  }

  }

  function init(root){
    if (root.dataset.hmInit) return;
    root.dataset.hmInit = '1';

    var cfg = {
      offx:  num(root.dataset.offx,   0.44),
      offy:  num(root.dataset.offy,  -0.02),
      dist:  num(root.dataset.dist,  10.4),
      moffx: num(root.dataset.moffx,  0.0),
      moffy: num(root.dataset.moffy, -0.30),
      mdist: num(root.dataset.mdist, 13.0),
      spin:  num(root.dataset.spin,   0.0016),
      animate: root.dataset.animate !== 'false'
    };

    var conn = navigator.connection || {};
    var lowEnd = conn.saveData === true || (navigator.deviceMemory && navigator.deviceMemory <= 2);
    if (lowEnd || !cfg.animate){ root.classList.add('static'); return; }

    function boot(){ engine(root, cfg); }
    function launch(){
      ('requestIdleCallback' in window) ? requestIdleCallback(boot, {timeout:1200}) : setTimeout(boot, 250);
    }
    (document.readyState === 'complete') ? launch() : addEventListener('load', launch, {once:true});
  }

  function initAll(){
    document.querySelectorAll('[data-hero-molecule]').forEach(init);
  }
  (document.readyState !== 'loading') ? initAll() : document.addEventListener('DOMContentLoaded', initAll);
  // Shopify theme editor: re-init when the section is (re)loaded
  document.addEventListener('shopify:section:load', function(e){
    var el = e.target.querySelector('[data-hero-molecule]');
    if (el){ delete el.dataset.hmInit; init(el); }
  });
})();
