import{n as e,s as t,t as n}from"./jsx-runtime-BseJUIpC.js";import{t as r}from"./animate-P72j_MEl.js";import{A as i,f as a,u as o}from"./index-q5otZ9YJ.js";import{a as s,s as c,t as l}from"./react-three-fiber.esm-BTPxG_xN.js";var u=t(e(),1),d=n(),f=o.close+o.hold+o.open,p=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,m=`
  precision highp float;
  varying vec2 vUv;
  uniform float uX;      // veil left edge, in vw (-200 .. 100)
  uniform float uDir;    // 1 forward, -1 back
  uniform float uTime;
  uniform float uAspect;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 s = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, s.x), mix(c, d, s.x), s.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += 0.5 * vnoise(p);
    v += 0.25 * vnoise(p * 2.13 + 7.7);
    v += 0.125 * vnoise(p * 4.31 + 19.1);
    return v / 0.875;
  }

  void main() {
    vec2 uv = vUv;

    // Silk ripple: the fabric coordinate undulates, strongest mid-height,
    // and the slight diagonal skew echoes the DOM veil's 100deg gradient.
    float wave = fbm(vec2(uv.x * 2.6 - uTime * 0.22, uv.y * 2.0 + uTime * 0.13));
    float belly = sin(uv.y * 3.14159);
    float rippleVw = (wave - 0.5) * 7.0 * (0.55 + 0.45 * belly);
    float skewVw = (uv.y - 0.5) * -12.0;

    float screenVw = uv.x * 100.0 + skewVw + rippleVw;
    // 0..1 across the 200vw-wide veil (same stops as the DOM gradient).
    float t = (screenVw - uX) / 200.0;

    float aIn = smoothstep(0.0, 0.12, t);
    float aOut = 1.0 - smoothstep(0.88, 1.0, t);
    float body = aIn * aOut;

    vec3 night = vec3(0.027, 0.012, 0.071);
    vec3 deep = vec3(0.055, 0.024, 0.125);
    vec3 plum = vec3(0.110, 0.051, 0.200);
    vec3 col = mix(night, deep, smoothstep(0.12, 0.50, t));
    col = mix(col, plum, smoothstep(0.50, 0.88, t));

    // Woven velvet sheen — slow-breathing folds of faint plum light.
    float sheen = fbm(vec2(uv.x * 5.2 + uTime * 0.06, uv.y * 4.1 - uTime * 0.04));
    col += (sheen - 0.5) * vec3(0.10, 0.055, 0.16);

    // Sparse champagne sparks woven into the fabric.
    vec2 cell = vec2(uv.x * 34.0 * uAspect, uv.y * 34.0);
    vec2 cellId = floor(cell);
    float pick = hash(cellId);
    float spark = 0.0;
    if (pick > 0.972) {
      vec2 centre = cellId + 0.5 + (vec2(hash(cellId + 3.1), hash(cellId + 5.7)) - 0.5) * 0.8;
      float d = length(cell - centre);
      float twinkle = 0.55 + 0.45 * sin(uTime * 2.4 + pick * 87.0);
      spark = smoothstep(0.18, 0.02, d) * twinkle;
    }
    col += spark * vec3(0.96, 0.85, 0.65) * 0.8;

    // The aurora hairline riding the leading edge (blush→orchid→champagne).
    float edgePos = uDir > 0.0 ? 0.88 : 0.12;
    float edgeDist = abs(t - edgePos);
    vec3 aurora = mix(
      vec3(0.97, 0.72, 0.83),
      mix(vec3(0.78, 0.58, 0.99), vec3(0.96, 0.85, 0.65), smoothstep(0.5, 1.0, uv.y)),
      smoothstep(0.0, 0.5, uv.y)
    );
    float hairline = 1.0 - smoothstep(0.0, 0.006, edgeDist);
    float bloom = exp(-edgeDist * 55.0) * 0.4;
    col += aurora * (hairline * 0.9 + bloom);

    // Fine grain so the silk matches the app's film-grain texture language.
    float grain = (hash(uv * vec2(917.0 * uAspect, 917.0) + fract(uTime) * 61.7) - 0.5) * 0.045;
    col += grain;

    float alpha = body * mix(1.0, 0.93, smoothstep(0.5, 0.88, t));
    gl_FragColor = vec4(col, alpha);
  }
`;function h({dir:e}){let{size:t}=c(),n=(0,u.useRef)(null),l=e===1?-200:100,h=e===1?100:-200,g=i(l);return(0,u.useEffect)(()=>{let e=[0,o.close/f,(o.close+o.hold)/f,1],t=r(g,[l,-50,-50,h],{duration:f,times:e,ease:[a,`linear`,a]});return()=>t.stop()},[g,l,h]),s(e=>{let r=n.current?.material;r&&(r.uniforms.uX.value=g.get(),r.uniforms.uTime.value=e.clock.elapsedTime,r.uniforms.uAspect.value=t.width/t.height)}),(0,d.jsxs)(`mesh`,{ref:n,frustumCulled:!1,children:[(0,d.jsx)(`planeGeometry`,{args:[2,2]}),(0,d.jsx)(`shaderMaterial`,{vertexShader:p,fragmentShader:m,uniforms:{uX:{value:l},uDir:{value:e},uTime:{value:0},uAspect:{value:1}},transparent:!0,depthWrite:!1,depthTest:!1})]})}function g({dir:e}){return(0,d.jsx)(`div`,{"aria-hidden":`true`,className:`absolute inset-0`,children:(0,d.jsx)(l,{dpr:[1,1.5],gl:{alpha:!0,antialias:!1,powerPreference:`high-performance`},style:{pointerEvents:`none`},children:(0,d.jsx)(h,{dir:e})})})}export{g as default};