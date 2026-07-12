import{n as e,s as t}from"./jsx-runtime-BseJUIpC.js";import{$ as n,L as r,a as i,ft as a,g as o,i as s,mt as c,pt as l,s as u}from"./react-three-fiber.esm-CFnglMUp.js";function d(){return d=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},d.apply(null,arguments)}var f=t(e()),p=parseInt(`184`.replace(/\D+/g,``)),m=class extends n{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${p>=154?`colorspace_fragment`:`encodings_fragment`}>
        }
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}},h=e=>e&&e.constructor===Float32Array,g=e=>[e.r,e.g,e.b],_=e=>e instanceof a||e instanceof l||e instanceof c,v=e=>Array.isArray(e)?e:_(e)?e.toArray():[e,e,e];function y(e,t,n){return f.useMemo(()=>{if(t!==void 0){if(h(t))return t;if(t instanceof o){let n=Array.from({length:e*3},()=>g(t)).flat();return Float32Array.from(n)}else if(_(t)||Array.isArray(t)){let n=Array.from({length:e*3},()=>v(t)).flat();return Float32Array.from(n)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},n)},[t])}var b=f.forwardRef(({noise:e=1,count:t=100,speed:n=1,opacity:a=1,scale:c=1,size:l,color:p,children:g,..._},b)=>{f.useMemo(()=>s({SparklesImplMaterial:m}),[]);let x=f.useRef(null),S=u(e=>e.viewport.dpr),C=v(c),w=f.useMemo(()=>Float32Array.from(Array.from({length:t},()=>C.map(r.randFloatSpread)).flat()),[t,...C]),T=y(t,l,Math.random),E=y(t,a),D=y(t,n),O=y(t*3,e),k=y(p===void 0?t*3:t,h(p)?p:new o(p),()=>1);return i(e=>{x.current&&x.current.material&&(x.current.material.time=e.clock.elapsedTime)}),f.useImperativeHandle(b,()=>x.current,[]),f.createElement(`points`,d({key:`particle-${t}-${JSON.stringify(c)}`},_,{ref:x}),f.createElement(`bufferGeometry`,null,f.createElement(`bufferAttribute`,{attach:`attributes-position`,args:[w,3]}),f.createElement(`bufferAttribute`,{attach:`attributes-size`,args:[T,1]}),f.createElement(`bufferAttribute`,{attach:`attributes-opacity`,args:[E,1]}),f.createElement(`bufferAttribute`,{attach:`attributes-speed`,args:[D,1]}),f.createElement(`bufferAttribute`,{attach:`attributes-color`,args:[k,3]}),f.createElement(`bufferAttribute`,{attach:`attributes-noise`,args:[O,3]})),g||f.createElement(`sparklesImplMaterial`,{transparent:!0,pixelRatio:S,depthWrite:!1}))});export{d as n,b as t};