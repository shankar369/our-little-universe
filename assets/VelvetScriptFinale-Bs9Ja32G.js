import{n as e,s as t,t as n}from"./jsx-runtime-BseJUIpC.js";import{$ as r,L as i,a,d as o,g as s,pt as c,rt as l,s as u,t as d,u as f}from"./react-three-fiber.esm-CtUhbn7y.js";var p=t(e(),1),m=`Navya`,h=`Navya’s Sankar`,g=200;function _(e){let t=(t,n)=>i.smoothstep(e,t,n);return{appear:t(.02,.09),form:t(.06,.2),ash:t(.24,.36),zoom:t(.24,.38),flip:t(.42,.5),turn:t(.54,.62),morph:t(.64,.745),line:t(.78,.885)}}function v(e){let t=e=>e*(1-e);return t(e.form)+t(e.ash)+t(e.morph)+t(e.line)}var y=typeof document<`u`?document.createElement(`canvas`):null;function b(e,t,n,r,i){if(!y)return e.split(``).map(()=>null);let a=y.getContext(`2d`,{willReadFrequently:!0});if(!a)return e.split(``).map(()=>null);a.font=i;let o=Math.ceil(a.measureText(e).width)+g,s=Math.ceil(g*1.7);y.width=o,y.height=s;let c=[],l=1/0,u=-1/0,d=1/0,f=-1/0;for(let t=0;t<e.length;t+=1){let n=e[t];if(n.trim()===``){c.push([]);continue}a.clearRect(0,0,o,s),a.font=i,a.fillStyle=`#fff`,a.textBaseline=`alphabetic`;let r=a.measureText(e.slice(0,t)).width;a.fillText(n,g/2+r,g*1.15);let p=a.getImageData(0,0,o,s).data,m=[];for(let e=0;e<s;e+=2)for(let t=0;t<o;t+=2)p[(e*o+t)*4+3]>140&&(m.push([t,e]),t<l&&(l=t),t>u&&(u=t),e<d&&(d=e),e>f&&(f=e));c.push(m)}if(l>u)return e.split(``).map(()=>null);let p=u-l||1,m=f-d||1,h=n===`width`?t/p:t/m,_=(l+u)/2,v=(d+f)/2;return c.map(e=>{if(e.length===0)return null;let t=1/0,n=-1/0,i=1/0,a=-1/0;return{points:e.map(([e,o])=>(e<t&&(t=e),e>n&&(n=e),o<i&&(i=o),o>a&&(a=o),[(e-_)*h,(v-o)*h+r])),center:[((t+n)/2-_)*h,(v-(i+a)/2)*h+r],width:(n-t)*h,height:(a-i)*h}})}function x(e,t,n=.014){let r=new Float32Array(t*3);for(let i=0;i<t;i+=1){let t=e[Math.random()*e.length|0];r[i*3]=t[0]+(Math.random()-.5)*n,r[i*3+1]=t[1]+(Math.random()-.5)*n,r[i*3+2]=(Math.random()-.5)*.1}return r}function S(e,t,n,r=1.4){let i=new Float32Array(e*3);for(let a=0;a<e;a+=1)i[a*3]=(Math.random()*2-1)*t,i[a*3+1]=(Math.random()*2-1)*n,i[a*3+2]=(Math.random()*2-1)*r;return i}function C(e,t,n){let r=new Float32Array(e);for(let i=0;i<e;i+=1)r[i]=t+Math.random()*(n-t);return r}function w(e,t,n=.75,r=1.2){let i=new Float32Array(e*3),a=new s;for(let o=0;o<e;o+=1){a.set(t[Math.random()*t.length|0]);let e=n+Math.random()*(r-n);i[o*3]=a.r*e,i[o*3+1]=a.g*e,i[o*3+2]=a.b*e}return i}function T(e,t,n,r,i,a){let o=Math.min(e*.78,6.4),s=Math.min(t*.52,e*.78),c=Math.min(e*.88,8.4),l=r?n.family:n.fallback,u=`${n.prefix} ${g}px ${l}`,d=b(m,o,`width`,t*.02,u),f=b(`N`,s,`height`,0,u)[0],p=b(h,c,`width`,0,u),_=d[0],v=p[8];if(!_||!f||!v)return null;let y=_.height/s,C=f.points,w=x(f.points,i),T=w,D=S(i,e*.75/y,t*.75/y,2.5),O=[];for(let e=1;e<d.length;e+=1){let t=d[e];t&&O.push(...t.points)}let k=[];p.forEach((e,t)=>{e&&t!==8&&k.push(...e.points)});let A=S(a,e*.72,t*.72),j=Math.min(Math.floor(a*.38),a),M=x(O,j),N=new Float32Array(a*3);N.set(M.subarray(0,j*3)),N.set(A.subarray(j*3),j*3);let P=new Float32Array(a*3);for(let n=0;n<a;n+=1)P[n*3]=A[n*3]*.85+1.6+Math.random()*e*.45,P[n*3+1]=A[n*3+1]*.85+.6+Math.random()*t*.3,P[n*3+2]=A[n*3+2];let F=x(k,a),I=E(N,a),L=E(w,i),R=new Float32Array(a);return R.fill(1,0,j),{heroCount:i,fieldCount:a,heroN:w,heroS:T,heroScatter:D,fieldWord:N,fieldScatter:A,fieldAsh:P,fieldLine:F,fieldMember:R,fieldRow:I,heroRow:L,wordNCenter:_.center,wordNScale:y,slotCenter:v.center,slotScale:v.height/(s*.92),wordChars:d,heroGlyph:f,sTargets:C}}function E(e,t){let n=1/0,r=-1/0;for(let i=0;i<t;i+=1){let t=e[i*3+1];t<n&&(n=t),t>r&&(r=t)}let i=r-n||1,a=new Float32Array(t);for(let r=0;r<t;r+=1)a[r]=1-(e[r*3+1]-n)/i;return a}function D(e,t=7){if(e.length<2)return[];let n=[...e].sort((e,t)=>e[1]-t[1]||e[0]-t[0]),r=[];for(let e=0;e<t;e+=1)r.push(n[Math.floor((e+.5)/t*n.length)]);let i=[];for(let e=0;e<r.length-1;e+=1)i.push(r[e][0],r[e][1],0,r[e+1][0],r[e+1][1],0);return i}function O(e){let[t,n]=(0,p.useState)(!1);return(0,p.useEffect)(()=>{let t=!0,r=()=>{t&&n(!0)};return document.fonts?.load?document.fonts.load(e).then(r).catch(r):r(),()=>{t=!1}},[e]),t}function k(e,t){let n=new o;for(let[e,{array:r,itemSize:i}]of Object.entries(t))n.setAttribute(e,new f(r,i));return n.setAttribute(`position`,new f(new Float32Array(e*3),3)),n.boundingSphere=new l(new c(0,0,0),100),n}function A(e){return e/(2*Math.tan(50*Math.PI/360))}var j=n();function M({targets:e,progress:t,children:n}){let r=(0,p.useRef)(null),o=(0,p.useRef)(null),s=(0,p.useRef)(null);return a(()=>{let n=_(t.get());if(s.current&&(s.current.rotation.x=Math.PI*n.flip),o.current&&(o.current.rotation.z=-Math.PI/2*n.turn),r.current){let t,a,o;n.line>0?(t=i.lerp(1,e.slotScale,n.line),a=i.lerp(0,e.slotCenter[0],n.line),o=i.lerp(0,e.slotCenter[1],n.line)):(t=i.lerp(e.wordNScale,1,n.zoom),a=i.lerp(e.wordNCenter[0],0,n.zoom),o=i.lerp(e.wordNCenter[1],0,n.zoom)),r.current.scale.setScalar(t),r.current.position.set(a,o,0)}}),(0,j.jsx)(`group`,{ref:r,children:(0,j.jsx)(`group`,{ref:o,children:(0,j.jsx)(`group`,{ref:s,children:n})})})}var N=`
  attribute vec3 aWord;
  attribute vec3 aScatter;
  attribute vec3 aAsh;
  attribute vec3 aLine;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  attribute float aRow;
  attribute float aMember;
  uniform float uForm;
  uniform float uAsh;
  uniform float uLine;
  uniform float uTime;
  uniform float uPx;
  uniform float uChurn;
  varying vec3 vColor;
  varying float vTwinkle;
`,P=`
  attribute vec3 aN;
  attribute vec3 aS;
  attribute vec3 aScatter;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  attribute float aRow;
  uniform float uForm;
  uniform float uMorph;
  uniform float uLine;
  uniform float uTime;
  uniform float uPx;
  uniform float uChurn;
  varying vec3 vColor;
  varying float vTwinkle;
`,F=`
  float stagger = fract(aSeed * 0.437) * 0.42;
  float formLocal = smoothstep(stagger, stagger + 0.58, uForm);
  float ashLocal = smoothstep(stagger * 0.5, stagger * 0.5 + 0.62, uAsh);
  float lineLocal = smoothstep(stagger * 0.55, stagger * 0.55 + 0.55, uLine);
  vec3 p = mix(aScatter, aWord, formLocal);
  p = mix(p, aAsh, ashLocal);
  p = mix(p, aLine, lineLocal);
  // Every traveller takes its own gentle arc between shapes.
  float transit = sin(formLocal * 3.14159) + sin(ashLocal * 3.14159) + sin(lineLocal * 3.14159);
  p.x += sin(aSeed * 6.2831) * transit * 0.34;
  p.y += cos(aSeed * 4.7124) * transit * 0.27;
`,I=`
  float stagger = fract(aSeed * 0.437) * 0.42;
  float formLocal = smoothstep(stagger, stagger + 0.58, uForm);
  float morphLocal = smoothstep(stagger * 0.6, stagger * 0.6 + 0.55, uMorph);
  vec3 p = mix(aScatter, aN, formLocal);
  p = mix(p, aS, morphLocal);
  float transit = sin(formLocal * 3.14159) + sin(morphLocal * 3.14159);
  p.x += sin(aSeed * 6.2831) * transit * 0.3;
  p.y += cos(aSeed * 4.7124) * transit * 0.24;
`,L=`
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * vTwinkle * uPx / max(-mv.z, 0.1);
  gl_Position = projectionMatrix * mv;
`;function R(e,t,n){let i=new r({vertexShader:e,fragmentShader:t,uniforms:{uForm:{value:0},uTime:{value:0},uPx:{value:800},uAlpha:{value:0},uChurn:{value:0},...n},transparent:!0,depthWrite:!1,blending:5});return i.blendEquation=100,i.blendSrc=204,i.blendDst=201,i.blendEquationAlpha=100,i.blendSrcAlpha=200,i.blendDstAlpha=201,i}function z({progress:e,density:t,config:n}){let{viewport:r,size:i}=u(),o=O(n.font.loadSpec),s=(0,p.useRef)(null),c=(0,p.useRef)(null),l=Math.max(200,Math.round(n.heroCount*(t??1))),d=Math.max(500,Math.round(n.fieldCount*(t??1))),f=(0,p.useMemo)(()=>T(r.width,r.height,n.font,o,l,d),[r.width,r.height,o,l,d]),m=n.glowRange??[.75,1.2],h=(0,p.useMemo)(()=>f?k(d,{aWord:{array:f.fieldWord,itemSize:3},aScatter:{array:f.fieldScatter,itemSize:3},aAsh:{array:f.fieldAsh,itemSize:3},aLine:{array:f.fieldLine,itemSize:3},aColor:{array:w(d,n.palette,...m),itemSize:3},aSize:{array:C(d,...n.fieldSize),itemSize:1},aSeed:{array:C(d,0,100),itemSize:1},aRow:{array:f.fieldRow,itemSize:1},aMember:{array:f.fieldMember,itemSize:1}}):null,[f,d]),g=(0,p.useMemo)(()=>f?k(l,{aN:{array:f.heroN,itemSize:3},aS:{array:f.heroS,itemSize:3},aScatter:{array:f.heroScatter,itemSize:3},aColor:{array:w(l,n.palette,...m),itemSize:3},aSize:{array:C(l,...n.heroSize),itemSize:1},aSeed:{array:C(l,0,100),itemSize:1},aRow:{array:f.heroRow,itemSize:1}}):null,[f,l]),y=(0,p.useMemo)(()=>R(n.fieldVertex,n.fragment,{uAsh:{value:0},uLine:{value:0}}),[]),b=(0,p.useMemo)(()=>R(n.heroVertex,n.fragment,{uMorph:{value:0},uLine:{value:0}}),[]);return(0,p.useEffect)(()=>()=>{h?.dispose(),g?.dispose()},[h,g]),(0,p.useEffect)(()=>()=>{y.dispose(),b.dispose()},[y,b]),a(t=>{if(!f)return;let n=t.clock.elapsedTime,r=_(e.get()),a=v(r),o=A(i.height),l=s.current?.material;l&&(l.uniforms.uTime.value=n,l.uniforms.uPx.value=o,l.uniforms.uAlpha.value=r.appear,l.uniforms.uForm.value=r.form,l.uniforms.uAsh.value=r.ash,l.uniforms.uLine.value=r.line,l.uniforms.uChurn.value=a);let u=c.current?.material;u&&(u.uniforms.uTime.value=n,u.uniforms.uPx.value=o,u.uniforms.uAlpha.value=r.appear,u.uniforms.uForm.value=r.form,u.uniforms.uMorph.value=r.morph,u.uniforms.uLine.value=r.line,u.uniforms.uChurn.value=a)}),!f||!h||!g?null:(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(`points`,{ref:s,geometry:h,material:y,frustumCulled:!1}),(0,j.jsx)(M,{targets:f,progress:e,children:(0,j.jsx)(`points`,{ref:c,geometry:g,material:b,frustumCulled:!1})}),n.extras?.(f,e)]})}function B(e){return function({progress:t,density:n}){return(0,j.jsx)(d,{camera:{position:[0,0,10],fov:50,near:.1,far:60},dpr:[1,1.5],gl:{alpha:!0,antialias:!1,powerPreference:`high-performance`},style:{pointerEvents:`none`},children:(0,j.jsx)(z,{progress:t,density:n,config:e})})}}var V=`
  float amp = 0.035 + uChurn * 0.8;
  vec2 flow = vec2(
    sin(p.y * 1.4 + uTime * 0.55 + aSeed * 0.7),
    cos(p.x * 1.15 - uTime * 0.42 + aSeed * 1.3)
  );
  p.x += flow.x * amp * 0.6;
  p.y += flow.y * amp * 0.45;
  p.z += sin(uTime * 0.5 + aSeed * 11.0) * amp * 0.25;

  vec3 blushTone = vec3(0.97, 0.72, 0.83);
  vec3 orchidTone = vec3(0.78, 0.58, 0.99);
  vec3 champagneTone = vec3(0.96, 0.85, 0.65);
  vec3 grad = mix(blushTone, orchidTone, smoothstep(0.0, 0.55, aRow));
  grad = mix(grad, champagneTone, smoothstep(0.55, 1.0, aRow));
  vColor = mix(aColor, grad, 0.72);
  vTwinkle = 0.75 + 0.25 * sin(uTime * 1.6 + aSeed * 43.0);
`,H=B({font:{prefix:`400`,family:`Parisienne, cursive`,fallback:`"Segoe Script", "Brush Script MT", cursive`,loadSpec:`400 200px Parisienne`},heroCount:1900,fieldCount:5200,palette:[`#f7b8d4`,`#c894fc`,`#f4d9a6`,`#f5f0ff`],glowRange:[.62,.98],fieldSize:[.05,.105],heroSize:[.055,.115],fieldVertex:`
  ${N}
  varying float vFade;
  void main() {
    ${F}
    ${V}

    // Ambient hearts whisper (small, faint) until the closing line gathers
    // every heart into the lettering; then everyone shrinks a touch so the
    // line stays delicate instead of fusing solid.
    float lineIn = smoothstep(0.0, 0.45, uLine);
    float present = max(aMember, lineIn);
    vFade = mix(0.28, 1.0, present);
    float sizeScale = mix(0.55, 1.0, present) * mix(1.0, 0.58, lineIn);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * sizeScale * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,heroVertex:`
  ${P}
  varying float vFade;
  void main() {
    ${I}
    ${V}
    vFade = 1.0;
    // The rig scales the swarm's positions into the line's S-slot, but sprite
    // sizes don't inherit that — shrink them alongside.
    float sizeScale = mix(1.0, 0.42, uLine);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * sizeScale * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,fragment:`
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vFade;
  void main() {
    vec2 hp = vec2(
      (gl_PointCoord.x - 0.5) * 2.6,
      -(gl_PointCoord.y - 0.5) * 2.6 - 0.16
    );
    float hx2 = hp.x * hp.x;
    float hy2 = hp.y * hp.y;
    float val = pow(hx2 + hy2 - 1.0, 3.0) - hx2 * hy2 * hp.y;
    float heart = 1.0 - smoothstep(-0.12, 0.05, val);

    gl_FragColor = vec4(
      vColor * (0.68 + 0.32 * vTwinkle),
      heart * uAlpha * 0.58 * vFade
    );
  }
`});export{P as a,M as c,I as i,D as l,F as n,L as o,N as r,B as s,H as t,_ as u};