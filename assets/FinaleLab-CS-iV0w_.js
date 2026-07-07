import{H as e,Rt as t,Wt as n,zt as r}from"./MotionConfigContext-hCaKQYCv.js";import{n as i}from"./createLucideIcon-2LrSzwSv.js";import{a,c as o,d as s,f as c,i as l,l as u,n as d,o as f,r as p,s as m,t as h,u as g}from"./VelvetScriptFinale-D5U2u56r.js";import{S as _,b as v,c as y,d as b,r as x}from"./index-CuIHG9Oq.js";import{a as S,k as C,o as w,r as T,u as E,w as D}from"./react-three-fiber.esm-YNYBXUc2.js";var O={some:0,all:1};function k(t,n,{root:r,margin:i,amount:a=`some`}={}){let o=e(t),s=new WeakMap,c=new IntersectionObserver(e=>{e.forEach(e=>{let t=s.get(e.target);if(e.isIntersecting!==!!t)if(e.isIntersecting){let t=n(e.target,e);typeof t==`function`?s.set(e.target,t):c.unobserve(e.target)}else typeof t==`function`&&(t(e),s.delete(e.target))})},{root:r,rootMargin:i,threshold:typeof a==`number`?a:O[a]});return o.forEach(e=>c.observe(e)),()=>c.disconnect()}var A=n(r(),1);function j(e,{root:t,margin:n,amount:r,once:i=!1,initial:a=!1}={}){let[o,s]=(0,A.useState)(a);return(0,A.useEffect)(()=>{if(!e.current||i&&o)return;let a=()=>(s(!0),i?void 0:()=>s(!1)),c={root:t&&t.current||void 0,margin:n,amount:r};return k(e.current,a,c)},[t,e,n,i,r]),o}var M=`
  float amp = 0.012 + uChurn * 0.65;
  p.x += sin(uTime * 1.7 + aSeed * 19.0) * amp * 0.4;
  p.y += cos(uTime * 2.0 + aSeed * 29.0) * amp * 0.34;
  p.z += sin(uTime * 1.3 + aSeed * 37.0) * amp * 0.3;

  float spinDir = fract(aSeed * 0.371) > 0.5 ? 1.0 : -1.0;
  vRot = aSeed * 6.2831 + uTime * (0.5 + uChurn * 3.5) * spinDir;
  vFlash = pow(0.5 + 0.5 * sin(uTime * 2.7 + aSeed * 91.0), 10.0) * 1.8;
  vColor = aColor;
  vTwinkle = 0.78 + 0.22 * sin(uTime * 2.2 + aSeed * 43.0);
`,N=m({font:{prefix:`700`,family:`"DM Sans", system-ui, sans-serif`,fallback:`system-ui, sans-serif`,loadSpec:`700 200px "DM Sans"`},heroCount:3400,fieldCount:10200,palette:[`#f5f0ff`,`#ffffff`,`#dcd0ff`,`#c894fc`,`#f5f0ff`],glowRange:[.7,1.2],fieldSize:[.028,.07],heroSize:[.032,.078],fieldVertex:`
  ${p}
  varying float vRot;
  varying float vFlash;
  void main() {
    ${d}
    ${M}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,heroVertex:`
  ${a}
  varying float vRot;
  varying float vFlash;
  void main() {
    ${l}
    ${M}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,fragment:`
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vRot;
  varying float vFlash;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float ca = cos(vRot);
    float sa = sin(vRot);
    vec2 r = vec2(c.x * ca - c.y * sa, c.x * sa + c.y * ca);
    // A rotating faceted shard: diamond silhouette + glint sweeping as it turns.
    float d = abs(r.x) + abs(r.y);
    float shard = smoothstep(0.5, 0.34, d);
    float facet = 0.5 + 0.5 * sin(vRot * 2.0);
    gl_FragColor = vec4(
      vColor * (0.5 + facet * 0.62 + vFlash) * vTwinkle,
      shard * uAlpha * 0.95
    );
  }
`}),P=`
  float f1 = 0.6 + fract(aSeed * 0.371) * 0.9;
  float f2 = 0.5 + fract(aSeed * 0.713) * 0.8;
  float orbit = 0.04 + fract(aSeed * 0.531) * 0.05 + uChurn * 0.55;
  p.x += sin(uTime * f1 + aSeed * 7.0) * orbit;
  p.y += cos(uTime * f2 + aSeed * 13.0) * orbit * 0.8;
  p.z += sin(uTime * 0.7 + aSeed * 29.0) * orbit * 0.5;

  vPulse = 0.5 + 0.5 * sin(uTime * (0.9 + fract(aSeed * 0.617) * 1.3) + aSeed * 17.0);
  vColor = aColor * (0.68 + 0.62 * vPulse);
  vTwinkle = 0.8 + 0.2 * vPulse;
`,F=m({font:{prefix:`italic 700`,family:`"Playfair Display", Georgia, serif`,fallback:`Georgia, serif`,loadSpec:`italic 700 200px "Playfair Display"`},heroCount:1200,fieldCount:3200,palette:[`#f4d9a6`,`#ffe9c4`,`#f7b8d4`,`#f4d9a6`],glowRange:[.8,1.3],fieldSize:[.1,.19],heroSize:[.11,.2],fieldVertex:`
  ${p}
  varying float vPulse;
  void main() {
    ${d}
    ${P}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,heroVertex:`
  ${a}
  varying float vPulse;
  void main() {
    ${l}
    ${P}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,fragment:`
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  varying float vPulse;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    // Soft bokeh orb with a faint bright core.
    float orb = exp(-d * d * 9.0) - 0.012;
    float core = smoothstep(0.16, 0.02, d) * 0.5;
    float a = max(orb, 0.0) * (0.5 + 0.5 * vPulse) + core * vPulse;
    gl_FragColor = vec4(vColor, a * uAlpha * 0.8);
  }
`}),I=m({font:{prefix:`600`,family:`Cinzel, "Times New Roman", serif`,fallback:`"Times New Roman", serif`,loadSpec:`600 200px Cinzel`},heroCount:3200,fieldCount:9200,palette:[`#f4d9a6`,`#ffe9c4`,`#e8bd7f`,`#f4d9a6`,`#f7b8d4`],glowRange:[.75,1.25],fieldSize:[.045,.095],heroSize:[.05,.105],fieldVertex:`
  ${p}
  void main() {
    float slideDir = sign(fract(aSeed * 0.531) - 0.5);

    // Stitch the word: gather to an entry point off the row's edge, slide in.
    float st = aRow * 0.55 + fract(aSeed * 0.371) * 0.12;
    float local = smoothstep(st, st + 0.33, uForm);
    vec3 entry = aWord + vec3(slideDir * (2.6 + fract(aSeed * 0.713) * 4.0), 0.0, 0.0);
    vec3 p = mix(aScatter, entry, smoothstep(0.0, max(st, 0.06), uForm));
    p = mix(p, aWord, local);

    // The a-v-y-a threads pull away on the wind.
    float ashStagger = fract(aSeed * 0.437) * 0.3;
    p = mix(p, aAsh, smoothstep(ashStagger, ashStagger + 0.7, uAsh));

    // The final line weaves itself the same way.
    float stL = aRow * 0.5 + fract(aSeed * 0.617) * 0.1;
    float localL = smoothstep(stL, stL + 0.35, uLine);
    vec3 entryL = aLine + vec3(slideDir * (2.2 + fract(aSeed * 0.813) * 3.0), 0.0, 0.0);
    vec3 stitched = mix(entryL, aLine, localL);
    p = mix(p, stitched, smoothstep(0.0, 0.22, uLine));

    p.y += sin(uTime * 1.8 + aSeed * 23.0) * (0.007 + uChurn * 0.4);
    vColor = aColor;
    vTwinkle = 0.7 + 0.3 * sin(uTime * 3.2 + aSeed * 47.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,heroVertex:`
  ${a}
  void main() {
    // The N unpicks row by row and re-stitches as the S.
    float stM = aRow * 0.5 + fract(aSeed * 0.617) * 0.12;
    float localM = smoothstep(stM, stM + 0.38, uMorph);
    float stagger = fract(aSeed * 0.437) * 0.4;
    vec3 p = mix(aScatter, aN, smoothstep(stagger, stagger + 0.6, uForm));
    p = mix(p, aS, localM);

    p.y += sin(uTime * 1.9 + aSeed * 27.0) * (0.006 + uChurn * 0.5);
    vColor = aColor;
    vTwinkle = 0.7 + 0.3 * sin(uTime * 3.4 + aSeed * 51.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`,fragment:`
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    // A tiny horizontal thread dash with a satin sheen.
    float a = exp(-pow(c.x / 0.5, 2.0) * 2.2) * exp(-pow(c.y / 0.16, 2.0) * 3.0);
    float sheen = 0.78 + 0.5 * pow(vTwinkle, 3.0);
    gl_FragColor = vec4(vColor * sheen, a * uAlpha * 0.95);
  }
`}),L=t(),R=`
  ${p}
  void main() {
    ${d}
    float amp = 0.01 + uChurn * 0.55;
    p.x += sin(uTime * 1.4 + aSeed * 19.0) * amp * 0.4;
    p.y += cos(uTime * 1.7 + aSeed * 29.0) * amp * 0.33;
    p.z += sin(uTime * 1.1 + aSeed * 37.0) * amp * 0.3;
    vColor = aColor;
    vTwinkle = 0.55 + 0.45 * pow(0.5 + 0.5 * sin(uTime * 2.1 + aSeed * 43.0), 2.0);
    ${f}
  }
`,z=`
  ${a}
  void main() {
    ${l}
    float amp = 0.009 + uChurn * 0.7;
    p.x += sin(uTime * 1.5 + aSeed * 23.0) * amp * 0.4;
    p.y += cos(uTime * 1.9 + aSeed * 31.0) * amp * 0.34;
    p.z += sin(uTime * 1.2 + aSeed * 41.0) * amp * 0.3;
    vColor = aColor;
    vTwinkle = 0.55 + 0.45 * pow(0.5 + 0.5 * sin(uTime * 2.4 + aSeed * 47.0), 2.0);
    ${f}
  }
`,B=`
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = smoothstep(0.3, 0.02, d);
    float rayX = (1.0 - smoothstep(0.0, 0.5, abs(c.x))) *
                 (1.0 - smoothstep(0.0, 0.045, abs(c.y)));
    float rayY = (1.0 - smoothstep(0.0, 0.5, abs(c.y))) *
                 (1.0 - smoothstep(0.0, 0.045, abs(c.x)));
    float a = clamp(core + (rayX + rayY) * 0.6 * vTwinkle, 0.0, 1.0);
    gl_FragColor = vec4(vColor * (0.75 + 0.4 * vTwinkle), a * uAlpha);
  }
`;function V({targets:e,progress:t}){let n=(0,A.useRef)(null),r=(0,A.useRef)(null),i=(0,A.useRef)(null),{wordGeo:a,heroNGeo:s,heroSGeo:c,materials:l}=(0,A.useMemo)(()=>{let t=[];for(let n of e.wordChars)n&&t.push(...u(n.points,7));let n=e=>{let t=new w;return t.setAttribute(`position`,new S(new Float32Array(e),3)),t.boundingSphere=new D(new C(0,0,0),100),t},r=()=>new E({color:`#c894fc`,transparent:!0,opacity:0});return{wordGeo:n(t),heroNGeo:n(u(e.heroGlyph.points,9)),heroSGeo:n(u(e.sTargets,9)),materials:[r(),r(),r()]}},[e]);return(0,A.useEffect)(()=>()=>{a.dispose(),s.dispose(),c.dispose(),l.forEach(e=>e.dispose())},[a,s,c,l]),T(()=>{let e=g(t.get()),a=1-e.line*.65,o=n.current?.material;o&&(o.opacity=e.appear*e.form*(1-e.ash)*.3);let s=r.current?.material;s&&(s.opacity=e.appear*e.form*(1-e.morph)*.36*a);let c=i.current?.material;c&&(c.opacity=e.appear*e.morph*.36*a)}),(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)(`lineSegments`,{ref:n,geometry:a,material:l[0],frustumCulled:!1}),(0,L.jsxs)(o,{targets:e,progress:t,children:[(0,L.jsx)(`lineSegments`,{ref:r,geometry:s,material:l[1],frustumCulled:!1}),(0,L.jsx)(`lineSegments`,{ref:i,geometry:c,material:l[2],frustumCulled:!1})]})]})}var H=m({font:{prefix:`italic 600`,family:`Fraunces, Georgia, serif`,fallback:`Georgia, serif`,loadSpec:`italic 600 200px Fraunces`},heroCount:3e3,fieldCount:9500,palette:[`#f5f0ff`,`#f5f0ff`,`#dcd0ff`,`#c894fc`,`#f4d9a6`],glowRange:[.8,1.35],fieldSize:[.022,.055],heroSize:[.026,.062],fieldVertex:R,heroVertex:z,fragment:B,extras:(e,t)=>(0,L.jsx)(V,{targets:e,progress:t})}),U=[{id:`velvet-script`,number:1,name:`Velvet Script`,fontLabel:`Parisienne · handwritten`,vibe:`the name handwritten in flowing script, drawn out of tiny drifting hearts — blush to orchid to champagne`,component:h},{id:`engraved-gold`,number:2,name:`Engraved Gold`,fontLabel:`Cinzel · roman capitals`,vibe:`a museum inscription stitched in gold thread, row by row; the N unpicks and re-stitches as the S`,component:I},{id:`starlight-italic`,number:3,name:`Starlight Italic`,fontLabel:`Fraunces italic · the house serif`,vibe:`the sky’s own language — named stars and faint constellation lines that re-link N into S`,component:H},{id:`crystal-modern`,number:4,name:`Crystal Modern`,fontLabel:`DM Sans bold · geometric`,vibe:`clean modern letters cut from tumbling crystal shards that glint as they turn; the N shatters and refreezes as the S`,component:N},{id:`editorial-waltz`,number:5,name:`Editorial Waltz`,fontLabel:`Playfair Display italic · classic romance`,vibe:`soft bokeh fireflies waltzing tiny orbits around high-contrast italics — dreamy, breathing, out of focus`,component:F}],W=560;function G(){let e=v(),{rich:t,compact:n}=x();return e||!t?(0,L.jsx)(`main`,{className:`flex min-h-svh items-center justify-center px-6 text-center text-starlight`,children:(0,L.jsx)(`p`,{className:`type-quote night-veil max-w-md text-moon`,children:`The screening room needs motion and WebGL — these are scroll-driven particle studies. Visit from a device with motion enabled.`})}):(0,L.jsxs)(`main`,{className:`relative text-starlight`,children:[(0,L.jsx)(K,{}),U.map(e=>(0,L.jsx)(q,{variant:e,density:n?.55:.85},e.id)),(0,L.jsx)(Y,{})]})}function K(){return(0,L.jsxs)(`section`,{className:`relative flex h-svh flex-col items-center justify-center gap-6 px-6 text-center`,children:[(0,L.jsxs)(`div`,{className:`night-veil`,children:[(0,L.jsxs)(`div`,{className:`mb-4 inline-flex items-center gap-2.5 text-champagne/85`,children:[(0,L.jsx)(b,{className:`h-3.5 w-3.5`}),(0,L.jsx)(`span`,{className:`type-eyebrow`,children:`the screening room · pick one`}),(0,L.jsx)(b,{className:`h-3.5 w-3.5`})]}),(0,L.jsxs)(`h1`,{className:`text-glow font-display text-[clamp(2.2rem,8vw,3.4rem)] font-medium leading-[1.06]`,children:[`the signature,`,(0,L.jsx)(`span`,{className:`type-quote text-aurora block pb-1`,children:`five ways.`})]}),(0,L.jsx)(`p`,{className:`type-quote mx-auto mt-5 max-w-md text-pretty text-base leading-7 text-moon`,children:`Five typefaces, five kinds of light — every one performs the same flip · turn · melt of the N into the S, driven by your scroll. Wander through, scrub back and forth, then tell me the number.`})]}),(0,L.jsx)(i.span,{animate:{y:[0,7,0]},transition:{duration:2.2,repeat:1/0,ease:`easeInOut`},className:`absolute bottom-[max(2.25rem,env(safe-area-inset-bottom))] text-champagne/80`,children:(0,L.jsx)(s,{className:`h-4.5 w-4.5`})})]})}function q({variant:e,density:t}){let n=(0,A.useRef)(null),{scrollYProgress:r}=c({target:n,offset:[`start start`,`end end`]}),a=j(n,{margin:`80% 0px 80% 0px`}),o=e.component,s=_(()=>r.get()),l=_(r,[0,.015,.96,1],[.4,1,1,.4]),u=_(()=>l.get());return(0,L.jsx)(`section`,{ref:n,style:{height:`${W}svh`},className:`relative`,"aria-label":`Variant ${e.number}: ${e.name}`,children:(0,L.jsxs)(`div`,{className:`sticky top-0 h-svh w-full overflow-hidden`,children:[a?(0,L.jsx)(o,{progress:r,density:t}):null,(0,L.jsx)(i.div,{style:{opacity:u},className:`pointer-events-none absolute inset-x-0 top-[max(1.25rem,env(safe-area-inset-top))] flex justify-center px-6`,children:(0,L.jsxs)(`div`,{className:`glass-chip max-w-full rounded-2xl px-4 py-2.5 text-center`,children:[(0,L.jsxs)(`p`,{className:`type-eyebrow text-champagne/85`,children:[`№`,String(e.number).padStart(2,`0`),` · `,e.name]}),(0,L.jsx)(`p`,{className:`mt-1 text-xs text-faint`,children:e.fontLabel})]})}),(0,L.jsx)(`div`,{className:`pointer-events-none absolute right-[max(0.9rem,env(safe-area-inset-right))] top-1/2 h-36 w-px -translate-y-1/2 bg-white/10`,children:(0,L.jsx)(i.div,{style:{scaleY:s},className:`h-full w-full origin-top bg-gradient-to-b from-blush via-orchid to-champagne`})}),(0,L.jsx)(J,{progress:r,text:e.vibe})]})})}function J({progress:e,text:t}){let n=_(e,[0,.02,.055,.08],[0,1,1,0]),r=_(()=>n.get());return(0,L.jsx)(i.p,{style:{opacity:r},className:`type-quote night-veil pointer-events-none absolute inset-x-0 bottom-[10%] mx-auto max-w-md px-6 text-center text-sm leading-6 text-moon`,children:t})}function Y(){return(0,L.jsx)(`section`,{className:`relative flex min-h-[50svh] flex-col items-center justify-center gap-4 px-6 text-center`,children:(0,L.jsx)(i.p,{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.6},transition:{duration:.7,ease:y},className:`type-script night-veil text-glow text-moon`,children:`which one felt like us? tell me the number.`})})}export{G as FinaleLab};