import{Q as e,g as t}from"./react-three-fiber.esm-C5uDhQBr.js";var n=[`#f4d9a6`,`#f4d9a6`,`#ffe9c4`,`#f7b8d4`,`#f7b8d4`,`#c894fc`],r=`
  uniform float uAlpha;
  uniform float uStretch;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    c.x /= (1.0 + uStretch * 2.5);
    float d = length(c);
    float a = smoothstep(0.5, 0.06, d);
    gl_FragColor = vec4(vColor * (0.8 + 0.35 * vTwinkle), a * uAlpha);
  }
`;function i(e){let r=new Float32Array(e*3),i=new t;for(let t=0;t<e;t+=1){i.set(n[Math.random()*n.length|0]);let e=.75+Math.random()*.45;r[t*3]=i.r*e,r[t*3+1]=i.g*e,r[t*3+2]=i.b*e}return r}function a(e,t,n){let r=new Float32Array(e);for(let i=0;i<e;i+=1)r[i]=t+Math.random()*(n-t);return r}function o(e,t,n,r=1.2){let i=new Float32Array(e*3);for(let a=0;a<e;a+=1)i[a*3]=(Math.random()*2-1)*t,i[a*3+1]=(Math.random()*2-1)*n,i[a*3+2]=(Math.random()*2-1)*r;return i}function s(t,n={}){let i=new e({vertexShader:t,fragmentShader:r,uniforms:{uTime:{value:0},uPx:{value:800},uAlpha:{value:0},uStretch:{value:0},...n},transparent:!0,depthWrite:!1,blending:5});return i.blendEquation=100,i.blendSrc=204,i.blendDst=201,i.blendEquationAlpha=100,i.blendSrcAlpha=200,i.blendDstAlpha=201,i}export{o as i,a as n,s as r,i as t};