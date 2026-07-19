import{n as e,s as t,t as n}from"./jsx-runtime-BseJUIpC.js";import{t as r}from"./animate-P72j_MEl.js";import{A as i}from"./index-zmRRfF3S.js";import{a,d as o,dt as s,nt as c,s as l,t as u,u as d}from"./react-three-fiber.esm-C5uDhQBr.js";import{n as f,r as p,t as m}from"./emberGlsl-DAu_6GrG.js";import{n as h}from"./pointSampling-VDjLHkB6.js";var g=t(e(),1),_=n(),v=`M50,86 C 22,64 10,45 10,30 C 10,17 19,9 30,9 C 39,9 46,16 50,23 C 54,16 61,9 70,9 C 81,9 90,17 90,30 C 90,45 78,64 50,86 Z`,y=900,b=400,x=[.5,0,.22,1],S=1.4,C=.75,w=`
  attribute vec2 aOutline;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uScale;   // world units the unit heart box spans right now
  uniform float uSpark;   // 0..1 outward spark energy
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 rim = aOutline * uScale;
    // Sparks fly outward along the rim normal-ish direction, each at its own
    // pace, wobbling as they cool.
    vec2 dir = normalize(aOutline + vec2(0.0001));
    float pace = 0.4 + fract(aSeed * 0.713) * 0.9;
    vec2 p = rim + dir * uSpark * pace * 1.6;
    p.x += sin(uTime * 2.1 + aSeed * 23.0) * 0.05 * (0.3 + uSpark);
    p.y += cos(uTime * 2.4 + aSeed * 31.0) * 0.05 * (0.3 + uSpark);

    vColor = aColor;
    vTwinkle = 0.72 + 0.28 * sin(uTime * 3.0 + aSeed * 43.0);
    vec4 mv = modelViewMatrix * vec4(p, 0.0, 1.0);
    gl_PointSize = aSize * vTwinkle * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`;function T({variant:e,compact:t}){let{viewport:n,size:u}=l(),T=(0,g.useRef)(null),E=t?b:y,D=i(0);(0,g.useEffect)(()=>{let t=r(D,1,{duration:e===`unlock`?S:C,ease:e===`unlock`?x:`easeInOut`});return()=>t.stop()},[D,e]);let O=(0,g.useMemo)(()=>{let e=h(v,E),t=1/0,n=-1/0,r=1/0,i=-1/0;for(let a=0;a<E;a+=1)t=Math.min(t,e[a*2]),n=Math.max(n,e[a*2]),r=Math.min(r,e[a*2+1]),i=Math.max(i,e[a*2+1]);let a=(t+n)/2,l=(r+i)/2,u=new Float32Array(E*2);for(let t=0;t<E;t+=1)u[t*2]=(e[t*2]-a)/100,u[t*2+1]=(l-e[t*2+1])/100;let p=new o;return p.setAttribute(`aOutline`,new d(u,2)),p.setAttribute(`aColor`,new d(m(E),3)),p.setAttribute(`aSize`,new d(f(E,.03,.07),1)),p.setAttribute(`aSeed`,new d(f(E,0,100),1)),p.setAttribute(`position`,new d(new Float32Array(E*3),3)),p.boundingSphere=new c(new s(0,0,0),100),p},[E]),k=(0,g.useMemo)(()=>p(w,{uScale:{value:0},uSpark:{value:0}}),[]);return(0,g.useEffect)(()=>()=>O.dispose(),[O]),(0,g.useEffect)(()=>()=>k.dispose(),[k]),a(t=>{let r=T.current?.material;if(!r)return;let i=D.get(),a=.02+(e===`unlock`?i:1-i)*3.38,o=Math.max(n.width,n.height),s=r.uniforms;s.uScale.value=a*o,s.uSpark.value=e===`unlock`?i*i:(1-i)*.25,s.uTime.value=t.clock.elapsedTime,s.uPx.value=u.height/(2*Math.tan(50*Math.PI/360)),s.uAlpha.value=Math.sin(Math.min(Math.max(i,0),1)*Math.PI)}),(0,_.jsx)(`points`,{ref:T,geometry:O,material:k,frustumCulled:!1})}function E(e){return(0,_.jsx)(`div`,{"aria-hidden":`true`,className:`absolute inset-0`,children:(0,_.jsx)(u,{camera:{position:[0,0,10],fov:50,near:.1,far:60},dpr:[1,1.5],gl:{alpha:!0,antialias:!1,powerPreference:`high-performance`},style:{pointerEvents:`none`},children:(0,_.jsx)(T,{...e})})})}export{E as default};