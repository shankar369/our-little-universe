import{At as e,B as t,Lt as n,Mt as r,Ot as i,Pt as a,Rt as o,V as s,Wt as c,_t as l,ct as u,gt as d,it as f,ot as p,rt as m,tt as h,vt as g,wt as _,zt as v}from"./MotionConfigContext-hCaKQYCv.js";import{a as y,c as ee,i as b,t as x}from"./createLucideIcon-2LrSzwSv.js";import{C as S,E as C,a as w,c as T,i as E,j as D,o as te,p as O,r as k,t as ne}from"./react-three-fiber.esm-B3VsUqb3.js";function A(e,t){let n,r=()=>{let{currentTime:r}=t,i=(r===null?0:r.value)/100;n!==i&&e(i),n=i};return l.preUpdate(r,!0),()=>d(r)}var j=c(v(),1);function M(e){return typeof window>`u`?!1:e?f():m()}var re=50,ie=()=>({current:0,offset:[],progress:0,scrollLength:0,targetOffset:0,targetLength:0,containerLength:0,velocity:0}),ae=()=>({time:0,x:ie(),y:ie()}),oe={x:{length:`Width`,position:`Left`},y:{length:`Height`,position:`Top`}};function se(e,t,n,r){let a=n[t],{length:o,position:s}=oe[t],c=a.current,l=n.time;a.current=Math.abs(e[`scroll${s}`]),a.scrollLength=e[`scroll${o}`]-e[`client${o}`],a.offset.length=0,a.offset[0]=0,a.offset[1]=a.scrollLength,a.progress=i(0,a.scrollLength,a.current);let u=r-l;a.velocity=u>re?0:_(a.current-c,u)}function ce(e,t,n){se(e,`x`,t,n),se(e,`y`,t,n),t.time=n}function le(e,t){let n={x:0,y:0},r=e;for(;r&&r!==t;)if(y(r))n.x+=r.offsetLeft,n.y+=r.offsetTop,r=r.offsetParent;else if(r.tagName===`svg`){let e=r.getBoundingClientRect();r=r.parentElement;let t=r.getBoundingClientRect();n.x+=e.left-t.left,n.y+=e.top-t.top}else if(r instanceof SVGGraphicsElement){let{x:e,y:t}=r.getBBox();n.x+=e,n.y+=t;let i=null,a=r.parentNode;for(;!i;)a.tagName===`svg`&&(i=a),a=r.parentNode;r=i}else break;return n}var N={start:0,center:.5,end:1};function ue(e,t,n=0){let r=0;if(e in N&&(e=N[e]),typeof e==`string`){let t=parseFloat(e);e.endsWith(`px`)?r=t:e.endsWith(`%`)?e=t/100:e.endsWith(`vw`)?r=t/100*document.documentElement.clientWidth:e.endsWith(`vh`)?r=t/100*document.documentElement.clientHeight:e=t}return typeof e==`number`&&(r=t*e),n+r}var de=[0,0];function fe(e,t,n,r){let i=Array.isArray(e)?e:de,a=0,o=0;return typeof e==`number`?i=[e,e]:typeof e==`string`&&(e=e.trim(),i=e.includes(` `)?e.split(` `):[e,N[e]?e:`0`]),a=ue(i[0],n,r),o=ue(i[1],t),a-o}var P={Enter:[[0,1],[1,1]],Exit:[[0,0],[1,0]],Any:[[1,0],[0,1]],All:[[0,0],[1,1]]},pe={x:0,y:0};function me(e){return`getBBox`in e&&e.tagName!==`svg`?e.getBBox():{width:e.clientWidth,height:e.clientHeight}}function he(e,t,n){let{offset:r=P.All}=n,{target:i=e,axis:o=`y`}=n,s=o===`y`?`height`:`width`,c=i===e?pe:le(i,e),l=i===e?{width:e.scrollWidth,height:e.scrollHeight}:me(i),d={width:e.clientWidth,height:e.clientHeight};t[o].offset.length=0;let f=!t[o].interpolate,m=r.length;for(let e=0;e<m;e++){let n=fe(r[e],d[s],l[s],c[o]);!f&&n!==t[o].interpolatorOffsets[e]&&(f=!0),t[o].offset[e]=n}f&&(t[o].interpolate=u(t[o].offset,p(r),{clamp:!1}),t[o].interpolatorOffsets=[...t[o].offset]),t[o].progress=a(0,1,t[o].interpolate(t[o].current))}function ge(e,t=e,n){if(n.x.targetOffset=0,n.y.targetOffset=0,t!==e){let r=t;for(;r&&r!==e;)n.x.targetOffset+=r.offsetLeft,n.y.targetOffset+=r.offsetTop,r=r.offsetParent}n.x.targetLength=t===e?t.scrollWidth:t.clientWidth,n.y.targetLength=t===e?t.scrollHeight:t.clientHeight,n.x.containerLength=e.clientWidth,n.y.containerLength=e.clientHeight}function _e(e,t,n,r={}){return{measure:t=>{ge(e,r.target,n),ce(e,n,t),(r.offset||r.target)&&he(e,n,r)},notify:()=>t(n)}}var F=new WeakMap,I=new WeakMap,L=new WeakMap,R=new WeakMap,z=new WeakMap,B=e=>e===document.scrollingElement?window:e;function V(t,{container:n=document.scrollingElement,trackContentSize:r=!1,...i}={}){if(!n)return e;let a=L.get(n);a||(a=new Set,L.set(n,a));let o=_e(n,t,ae(),i);if(a.add(o),!F.has(n)){let e=()=>{for(let e of a)e.measure(g.timestamp);l.preUpdate(t)},t=()=>{for(let e of a)e.notify()},r=()=>l.read(e);F.set(n,r);let i=B(n);window.addEventListener(`resize`,r),n!==document.documentElement&&I.set(n,b(n,r)),i.addEventListener(`scroll`,r),r()}if(r&&!z.has(n)){let e=F.get(n),t={width:n.scrollWidth,height:n.scrollHeight};R.set(n,t);let r=l.read(()=>{let r=n.scrollWidth,i=n.scrollHeight;(t.width!==r||t.height!==i)&&(e(),t.width=r,t.height=i)},!0);z.set(n,r)}let s=F.get(n);return l.read(s,!1,!0),()=>{d(s);let e=L.get(n);if(!e||(e.delete(o),e.size))return;let t=F.get(n);F.delete(n),t&&(B(n).removeEventListener(`scroll`,t),I.get(n)?.(),window.removeEventListener(`resize`,t));let r=z.get(n);r&&(d(r),z.delete(n)),R.delete(n)}}var ve=[[P.Enter,`entry`],[P.Exit,`exit`],[P.Any,`cover`],[P.All,`contain`]],H={start:0,end:1};function ye(e){let t=e.trim().split(/\s+/);if(t.length!==2)return;let n=H[t[0]],r=H[t[1]];if(!(n===void 0||r===void 0))return[n,r]}function be(e){if(e.length!==2)return;let t=[];for(let n of e)if(Array.isArray(n))t.push(n);else if(typeof n==`string`){let e=ye(n);if(!e)return;t.push(e)}else return;return t}function xe(e,t){let n=be(e);if(!n)return!1;for(let e=0;e<2;e++){let r=n[e],i=t[e];if(r[0]!==i[0]||r[1]!==i[1])return!1}return!0}function U(e){if(!e)return{rangeStart:`contain 0%`,rangeEnd:`contain 100%`};for(let[t,n]of ve)if(xe(e,t))return{rangeStart:`${n} 0%`,rangeEnd:`${n} 100%`}}var Se=new Map;function Ce(e){let t={value:0};return{currentTime:t,cancel:V(n=>{t.value=n[e.axis].progress*100},e)}}function we({source:e,container:t,...n}){let{axis:r}=n;e&&(t=e);let i=Se.get(t);i||(i=new Map,Se.set(t,i));let a=n.target??`self`,o=i.get(a);o||(o={},i.set(a,o));let s=r+(n.offset??[]).join(`,`);return o[s]||(n.target&&M(n.target)?U(n.offset)?o[s]=new ViewTimeline({subject:n.target,axis:r}):o[s]=Ce({container:t,...n}):M()?o[s]=new ScrollTimeline({source:t,axis:r}):o[s]=Ce({container:t,...n})),o[s]}function Te(e,t){let n=we(t),r=t.target?U(t.offset):void 0,i=t.target?M(t.target)&&!!r:M();return e.attachTimeline({timeline:i?n:void 0,...r&&i&&{rangeStart:r.rangeStart,rangeEnd:r.rangeEnd},observe:e=>(e.pause(),A(t=>{e.time=e.iterationDuration*t},n))})}function Ee(e){return e&&(e.target||e.offset)}function De(e){return e.length===2}function Oe(e,t){return De(e)||Ee(t)?V(n=>{e(n[t.axis].progress,n)},t):A(e,we(t))}function ke(t,{axis:n=`y`,container:r=document.scrollingElement,...i}={}){if(!r)return e;let a={axis:n,container:r,...i};return typeof t==`function`?Oe(t,a):Te(t,a)}var Ae=()=>({scrollX:h(0),scrollY:h(0),scrollXProgress:h(0),scrollYProgress:h(0)}),W=e=>e?!e.current:!1;function je(e,n,r,i){return{factory:a=>{let o,c=()=>{if(W(r)||W(i)){s.read(c);return}o=ke(a,{...n,axis:e,container:r?.current||void 0,target:i?.current||void 0})};return s.read(c),()=>{t(c),o?.()}},times:[0,1],keyframes:[0,1],ease:e=>e,duration:1}}function Me(e,t){return typeof window>`u`?!1:e?f()&&!!U(t):m()}function Ne({container:e,target:i,...a}={}){let o=n(Ae);Me(i,a.offset)&&(o.scrollXProgress.accelerate=je(`x`,a,e,i),o.scrollYProgress.accelerate=je(`y`,a,e,i));let c=(0,j.useRef)(null),l=(0,j.useRef)(!1),u=(0,j.useCallback)(()=>(c.current=ke((e,{x:t,y:n})=>{o.scrollX.set(t.current),o.scrollXProgress.set(t.progress),o.scrollY.set(n.current),o.scrollYProgress.set(n.progress)},{...a,container:e?.current||void 0,target:i?.current||void 0}),()=>{c.current?.()}),[e,i,JSON.stringify(a.offset)]);return ee(()=>{if(l.current=!1,W(e)||W(i)){l.current=!0;return}else return u()},[u]),(0,j.useEffect)(()=>{if(!l.current)return;let n,a=()=>{let t=W(e),a=W(i);r(!t,`Container ref is defined but not hydrated`,`use-scroll-ref`),r(!a,`Target ref is defined but not hydrated`,`use-scroll-ref`),!t&&!a&&(n=u())};return s.read(a),()=>{t(a),n?.()}},[u]),o}var Pe=x(`chevron-down`,[[`path`,{d:`m6 9 6 6 6-6`,key:`qrunsl`}]]),Fe=`Navya`,Ie=`Navya’s Sankar`,G=200;function K(e){let t=(t,n)=>O.smoothstep(e,t,n);return{appear:t(.02,.09),form:t(.06,.2),ash:t(.24,.36),zoom:t(.24,.38),flip:t(.42,.5),turn:t(.54,.62),morph:t(.64,.745),line:t(.78,.885)}}function Le(e){let t=e=>e*(1-e);return t(e.form)+t(e.ash)+t(e.morph)+t(e.line)}var q=typeof document<`u`?document.createElement(`canvas`):null;function J(e,t,n,r,i){if(!q)return e.split(``).map(()=>null);let a=q.getContext(`2d`,{willReadFrequently:!0});if(!a)return e.split(``).map(()=>null);a.font=i;let o=Math.ceil(a.measureText(e).width)+G,s=Math.ceil(G*1.7);q.width=o,q.height=s;let c=[],l=1/0,u=-1/0,d=1/0,f=-1/0;for(let t=0;t<e.length;t+=1){let n=e[t];if(n.trim()===``){c.push([]);continue}a.clearRect(0,0,o,s),a.font=i,a.fillStyle=`#fff`,a.textBaseline=`alphabetic`;let r=a.measureText(e.slice(0,t)).width;a.fillText(n,G/2+r,G*1.15);let p=a.getImageData(0,0,o,s).data,m=[];for(let e=0;e<s;e+=2)for(let t=0;t<o;t+=2)p[(e*o+t)*4+3]>140&&(m.push([t,e]),t<l&&(l=t),t>u&&(u=t),e<d&&(d=e),e>f&&(f=e));c.push(m)}if(l>u)return e.split(``).map(()=>null);let p=u-l||1,m=f-d||1,h=n===`width`?t/p:t/m,g=(l+u)/2,_=(d+f)/2;return c.map(e=>{if(e.length===0)return null;let t=1/0,n=-1/0,i=1/0,a=-1/0;return{points:e.map(([e,o])=>(e<t&&(t=e),e>n&&(n=e),o<i&&(i=o),o>a&&(a=o),[(e-g)*h,(_-o)*h+r])),center:[((t+n)/2-g)*h,(_-(i+a)/2)*h+r],width:(n-t)*h,height:(a-i)*h}})}function Y(e,t,n=.014){let r=new Float32Array(t*3);for(let i=0;i<t;i+=1){let t=e[Math.random()*e.length|0];r[i*3]=t[0]+(Math.random()-.5)*n,r[i*3+1]=t[1]+(Math.random()-.5)*n,r[i*3+2]=(Math.random()-.5)*.1}return r}function Re(e,t,n,r=1.4){let i=new Float32Array(e*3);for(let a=0;a<e;a+=1)i[a*3]=(Math.random()*2-1)*t,i[a*3+1]=(Math.random()*2-1)*n,i[a*3+2]=(Math.random()*2-1)*r;return i}function X(e,t,n){let r=new Float32Array(e);for(let i=0;i<e;i+=1)r[i]=t+Math.random()*(n-t);return r}function ze(e,t,n=.75,r=1.2){let i=new Float32Array(e*3),a=new T;for(let o=0;o<e;o+=1){a.set(t[Math.random()*t.length|0]);let e=n+Math.random()*(r-n);i[o*3]=a.r*e,i[o*3+1]=a.g*e,i[o*3+2]=a.b*e}return i}function Be(e,t,n,r,i,a){let o=Math.min(e*.78,6.4),s=Math.min(t*.52,e*.78),c=Math.min(e*.88,8.4),l=r?n.family:n.fallback,u=`${n.prefix} ${G}px ${l}`,d=J(Fe,o,`width`,t*.02,u),f=J(`N`,s,`height`,0,u)[0],p=J(Ie,c,`width`,0,u),m=d[0],h=p[8];if(!m||!f||!h)return null;let g=m.height/s,_=f.points,v=Y(f.points,i),y=v,ee=Re(i,e*.75/g,t*.75/g,2.5),b=[];for(let e=1;e<d.length;e+=1){let t=d[e];t&&b.push(...t.points)}let x=[];p.forEach((e,t)=>{e&&t!==8&&x.push(...e.points)});let S=Re(a,e*.72,t*.72),C=Math.min(Math.floor(a*.38),a),w=Y(b,C),T=new Float32Array(a*3);T.set(w.subarray(0,C*3)),T.set(S.subarray(C*3),C*3);let E=new Float32Array(a*3);for(let n=0;n<a;n+=1)E[n*3]=S[n*3]*.85+1.6+Math.random()*e*.45,E[n*3+1]=S[n*3+1]*.85+.6+Math.random()*t*.3,E[n*3+2]=S[n*3+2];let D=Y(x,a),te=Ve(T,a),O=Ve(v,i),k=new Float32Array(a);return k.fill(1,0,C),{heroCount:i,fieldCount:a,heroN:v,heroS:y,heroScatter:ee,fieldWord:T,fieldScatter:S,fieldAsh:E,fieldLine:D,fieldMember:k,fieldRow:te,heroRow:O,wordNCenter:m.center,wordNScale:g,slotCenter:h.center,slotScale:h.height/(s*.92),wordChars:d,heroGlyph:f,sTargets:_}}function Ve(e,t){let n=1/0,r=-1/0;for(let i=0;i<t;i+=1){let t=e[i*3+1];t<n&&(n=t),t>r&&(r=t)}let i=r-n||1,a=new Float32Array(t);for(let r=0;r<t;r+=1)a[r]=1-(e[r*3+1]-n)/i;return a}function He(e,t=7){if(e.length<2)return[];let n=[...e].sort((e,t)=>e[1]-t[1]||e[0]-t[0]),r=[];for(let e=0;e<t;e+=1)r.push(n[Math.floor((e+.5)/t*n.length)]);let i=[];for(let e=0;e<r.length-1;e+=1)i.push(r[e][0],r[e][1],0,r[e+1][0],r[e+1][1],0);return i}function Ue(e){let[t,n]=(0,j.useState)(!1);return(0,j.useEffect)(()=>{let t=!0,r=()=>{t&&n(!0)};return document.fonts?.load?document.fonts.load(e).then(r).catch(r):r(),()=>{t=!1}},[e]),t}function Z(e,t){let n=new te;for(let[e,{array:r,itemSize:i}]of Object.entries(t))n.setAttribute(e,new w(r,i));return n.setAttribute(`position`,new w(new Float32Array(e*3),3)),n.boundingSphere=new C(new D(0,0,0),100),n}function We(e){return e/(2*Math.tan(50*Math.PI/360))}var Q=o();function Ge({targets:e,progress:t,children:n}){let r=(0,j.useRef)(null),i=(0,j.useRef)(null),a=(0,j.useRef)(null);return k(()=>{let n=K(t.get());if(a.current&&(a.current.rotation.x=Math.PI*n.flip),i.current&&(i.current.rotation.z=-Math.PI/2*n.turn),r.current){let t,i,a;n.line>0?(t=O.lerp(1,e.slotScale,n.line),i=O.lerp(0,e.slotCenter[0],n.line),a=O.lerp(0,e.slotCenter[1],n.line)):(t=O.lerp(e.wordNScale,1,n.zoom),i=O.lerp(e.wordNCenter[0],0,n.zoom),a=O.lerp(e.wordNCenter[1],0,n.zoom)),r.current.scale.setScalar(t),r.current.position.set(i,a,0)}}),(0,Q.jsx)(`group`,{ref:r,children:(0,Q.jsx)(`group`,{ref:i,children:(0,Q.jsx)(`group`,{ref:a,children:n})})})}var Ke=`
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
`,qe=`
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
`,Je=`
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
`,Ye=`
  float stagger = fract(aSeed * 0.437) * 0.42;
  float formLocal = smoothstep(stagger, stagger + 0.58, uForm);
  float morphLocal = smoothstep(stagger * 0.6, stagger * 0.6 + 0.55, uMorph);
  vec3 p = mix(aScatter, aN, formLocal);
  p = mix(p, aS, morphLocal);
  float transit = sin(formLocal * 3.14159) + sin(morphLocal * 3.14159);
  p.x += sin(aSeed * 6.2831) * transit * 0.3;
  p.y += cos(aSeed * 4.7124) * transit * 0.24;
`,Xe=`
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * vTwinkle * uPx / max(-mv.z, 0.1);
  gl_Position = projectionMatrix * mv;
`;function Ze(e,t,n){let r=new S({vertexShader:e,fragmentShader:t,uniforms:{uForm:{value:0},uTime:{value:0},uPx:{value:800},uAlpha:{value:0},uChurn:{value:0},...n},transparent:!0,depthWrite:!1,blending:5});return r.blendEquation=100,r.blendSrc=204,r.blendDst=201,r.blendEquationAlpha=100,r.blendSrcAlpha=200,r.blendDstAlpha=201,r}function Qe({progress:e,density:t,config:n}){let{viewport:r,size:i}=E(),a=Ue(n.font.loadSpec),o=(0,j.useRef)(null),s=(0,j.useRef)(null),c=Math.max(200,Math.round(n.heroCount*(t??1))),l=Math.max(500,Math.round(n.fieldCount*(t??1))),u=(0,j.useMemo)(()=>Be(r.width,r.height,n.font,a,c,l),[r.width,r.height,a,c,l]),d=n.glowRange??[.75,1.2],f=(0,j.useMemo)(()=>u?Z(l,{aWord:{array:u.fieldWord,itemSize:3},aScatter:{array:u.fieldScatter,itemSize:3},aAsh:{array:u.fieldAsh,itemSize:3},aLine:{array:u.fieldLine,itemSize:3},aColor:{array:ze(l,n.palette,...d),itemSize:3},aSize:{array:X(l,...n.fieldSize),itemSize:1},aSeed:{array:X(l,0,100),itemSize:1},aRow:{array:u.fieldRow,itemSize:1},aMember:{array:u.fieldMember,itemSize:1}}):null,[u,l]),p=(0,j.useMemo)(()=>u?Z(c,{aN:{array:u.heroN,itemSize:3},aS:{array:u.heroS,itemSize:3},aScatter:{array:u.heroScatter,itemSize:3},aColor:{array:ze(c,n.palette,...d),itemSize:3},aSize:{array:X(c,...n.heroSize),itemSize:1},aSeed:{array:X(c,0,100),itemSize:1},aRow:{array:u.heroRow,itemSize:1}}):null,[u,c]),m=(0,j.useMemo)(()=>Ze(n.fieldVertex,n.fragment,{uAsh:{value:0},uLine:{value:0}}),[]),h=(0,j.useMemo)(()=>Ze(n.heroVertex,n.fragment,{uMorph:{value:0},uLine:{value:0}}),[]);return(0,j.useEffect)(()=>()=>{f?.dispose(),p?.dispose()},[f,p]),(0,j.useEffect)(()=>()=>{m.dispose(),h.dispose()},[m,h]),k(t=>{if(!u)return;let n=t.clock.elapsedTime,r=K(e.get()),a=Le(r),c=We(i.height),l=o.current?.material;l&&(l.uniforms.uTime.value=n,l.uniforms.uPx.value=c,l.uniforms.uAlpha.value=r.appear,l.uniforms.uForm.value=r.form,l.uniforms.uAsh.value=r.ash,l.uniforms.uLine.value=r.line,l.uniforms.uChurn.value=a);let d=s.current?.material;d&&(d.uniforms.uTime.value=n,d.uniforms.uPx.value=c,d.uniforms.uAlpha.value=r.appear,d.uniforms.uForm.value=r.form,d.uniforms.uMorph.value=r.morph,d.uniforms.uLine.value=r.line,d.uniforms.uChurn.value=a)}),!u||!f||!p?null:(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(`points`,{ref:o,geometry:f,material:m,frustumCulled:!1}),(0,Q.jsx)(Ge,{targets:u,progress:e,children:(0,Q.jsx)(`points`,{ref:s,geometry:p,material:h,frustumCulled:!1})}),n.extras?.(u,e)]})}function $e(e){return function({progress:t,density:n}){return(0,Q.jsx)(ne,{camera:{position:[0,0,10],fov:50,near:.1,far:60},dpr:[1,1.5],gl:{alpha:!0,antialias:!1,powerPreference:`high-performance`},style:{pointerEvents:`none`},children:(0,Q.jsx)(Qe,{progress:t,density:n,config:e})})}}var $=`
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
`,et=$e({font:{prefix:`400`,family:`Parisienne, cursive`,fallback:`"Segoe Script", "Brush Script MT", cursive`,loadSpec:`400 200px Parisienne`},heroCount:1900,fieldCount:5200,palette:[`#f7b8d4`,`#c894fc`,`#f4d9a6`,`#f5f0ff`],glowRange:[.62,.98],fieldSize:[.05,.105],heroSize:[.055,.115],fieldVertex:`
  ${Ke}
  varying float vFade;
  void main() {
    ${Je}
    ${$}

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
  ${qe}
  varying float vFade;
  void main() {
    ${Ye}
    ${$}
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
`});export{qe as a,Ge as c,Pe as d,Ne as f,Ye as i,He as l,Je as n,Xe as o,Ke as r,$e as s,et as t,K as u};