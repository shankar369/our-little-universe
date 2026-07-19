import{n as e,s as t,t as n}from"./jsx-runtime-BseJUIpC.js";import{n as r}from"./createLucideIcon-LXKMqBEJ.js";import{_t as i}from"./MotionConfigContext-BuShiuaj.js";import{A as a,D as o,O as s,j as c}from"./index-EO5T2ajC.js";import{L as l,a as u,d,dt as f,nt as p,s as m,t as h,u as g}from"./react-three-fiber.esm-CUGbWCDU.js";import{i as _,n as v,r as y,t as b}from"./emberGlsl-DrCKdYrA.js";var x=t(e(),1);function S(e,t,n){(0,x.useInsertionEffect)(()=>e.on(t,n),[e,t,n])}function C(e){let t=a(e.getVelocity()),n=()=>{let r=e.getVelocity();t.set(r),r&&i.update(n)};return S(e,`change`,()=>{i.update(n,!1,!0)}),t}var w=n();function T(){let e=(0,x.useRef)(null),{scrollYProgress:t}=c({target:e,offset:[`start 0.95`,`start 0.25`]}),n=s(t,[0,.5,1],[0,1,0]),i=s(()=>n.get()),a=s(t,[0,.55],[.25,1]);return(0,w.jsx)(`div`,{ref:e,"aria-hidden":`true`,className:`relative h-px w-full motion-reduce:hidden`,children:(0,w.jsx)(r.div,{style:{opacity:i,scaleX:a,background:`linear-gradient(90deg, transparent, rgba(200,148,252,0.55) 30%, rgba(247,184,212,0.75) 50%, rgba(244,217,166,0.55) 70%, transparent)`,boxShadow:`0 0 22px rgba(200,148,252,0.4)`},className:`absolute inset-x-[6%] top-0 h-px`})})}var E=10,D=50,O=1e3,k=450,A=4e3,j=`
  attribute vec3 aBase;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uDrift;
  uniform float uGlow;
  uniform float uSpanY;
  uniform float uWarm;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    // Each ember rises at its own gentle pace; scroll drift adds a shared
    // current (per-ember factor keeps the field from moving as one plate).
    float rise = 0.05 + fract(aSeed * 0.371) * 0.09;
    float y = aBase.y + uTime * rise + uDrift * (0.55 + fract(aSeed * 0.731) * 0.9);
    y = mod(y + uSpanY * 0.5, uSpanY) - uSpanY * 0.5;
    float sway = sin(uTime * (0.4 + fract(aSeed * 0.517)) + aSeed) * 0.12;
    vec3 p = vec3(aBase.x + sway, y, aBase.z);

    // The whole field warms toward gold as the cinema deepens.
    float lum = max(aColor.r, max(aColor.g, aColor.b));
    vColor = mix(aColor, vec3(1.0, 0.86, 0.58) * lum, uWarm);
    vTwinkle = 0.7 + 0.3 * sin(uTime * 2.2 + aSeed * 43.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * vTwinkle * (1.0 + uGlow * 0.5) * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;function M({count:e,drift:t,pageProgress:n,finaleProgress:r,streak:i}){let{viewport:a,size:o}=m(),s=(0,x.useRef)(null),c=(0,x.useRef)(0),h=(0,x.useRef)(0),S=(0,x.useMemo)(()=>{let t=new d;return t.setAttribute(`aBase`,new g(_(e,a.width*.55,a.height*.58),3)),t.setAttribute(`aColor`,new g(b(e),3)),t.setAttribute(`aSize`,new g(v(e,.018,.05),1)),t.setAttribute(`aSeed`,new g(v(e,0,100),1)),t.setAttribute(`position`,new g(new Float32Array(e*3),3)),t.boundingSphere=new p(new f(0,0,0),100),t},[e,a.width,a.height]),C=(0,x.useMemo)(()=>y(j,{uDrift:{value:0},uGlow:{value:0},uSpanY:{value:10},uWarm:{value:0}}),[]);return(0,x.useEffect)(()=>()=>S.dispose(),[S]),(0,x.useEffect)(()=>()=>C.dispose(),[C]),u((e,u)=>{let d=l.clamp(t.get(),-4e3,A),f=a.height/o.height;c.current+=d*f*u*.35,h.current=Math.min(h.current+u/1.2,1);let p=Math.min(Math.abs(d)/2500,1),m=1-r.get()*.75,g=s.current?.material;if(!g)return;let _=g.uniforms;_.uTime.value=e.clock.elapsedTime,_.uPx.value=o.height/(2*Math.tan(D*Math.PI/360)),_.uDrift.value=c.current,_.uGlow.value=p,_.uSpanY.value=a.height*1.16,_.uWarm.value=n.get()*.55,_.uAlpha.value=h.current*.85*m,_.uStretch.value=i?.get()??0}),(0,w.jsx)(`points`,{ref:s,geometry:S,material:C,frustumCulled:!1})}function N({compact:e,dimmingRef:t,streak:n}){let{scrollY:r,scrollYProgress:i}=c(),a=o(C(r),{stiffness:60,damping:24,mass:.8}),{scrollYProgress:s}=c({target:t,offset:[`start end`,`start start`]});return(0,w.jsx)(`div`,{"aria-hidden":`true`,className:`pointer-events-none fixed inset-0 z-0`,children:(0,w.jsx)(h,{camera:{position:[0,0,E],fov:D,near:.1,far:60},dpr:[1,1.5],gl:{alpha:!0,antialias:!1,powerPreference:`high-performance`},style:{pointerEvents:`none`},children:(0,w.jsx)(M,{count:e?k:O,drift:a,pageProgress:i,finaleProgress:s,streak:n})})})}export{S as i,T as n,C as r,N as t};