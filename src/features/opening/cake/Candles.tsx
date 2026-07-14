import { useEffect, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CAKE_TOP_Y, CANDLES } from './cakeLayout'
import {
  CASCADE_STEP_MS,
  type CakePhase,
} from './cakeShared'
import {
  makeFlameGlowTexture,
  makeSmokeTexture,
  makeStripeTexture,
} from './cakeTextures'
import { useAssembleParts } from './useAssembleParts'

/**
 * Five striped candles in a loose ring on the top tier. Each flame is a tiny
 * GLSL teardrop billboard (procedural sway, warm core) over an additive halo;
 * blowing them out swaps the flame for a rising smoke wisp and a fading ember
 * on the wick. One shared flickering point light sells the candlelight.
 */

// ---------------------------------------------------------------------------
// Module-level shared resources
// ---------------------------------------------------------------------------

const stripePalette = ['#ef86bb', '#a86ef0', '#eab86a']
const waxMaterials = stripePalette.map(
  (stripe) =>
    new THREE.MeshPhysicalMaterial({
      map: makeStripeTexture(stripe),
      roughness: 0.38,
      clearcoat: 0.55,
      clearcoatRoughness: 0.3,
      envMapIntensity: 0.6,
    }),
)
const wickMaterial = new THREE.MeshStandardMaterial({
  color: '#3a2d3f',
  roughness: 0.9,
})
const hitProxyMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
})
const glowTexture = makeFlameGlowTexture()
const smokeTexture = makeSmokeTexture()

const FLAME_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FLAME_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uLife;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    vec2 p = vec2((vUv.x - 0.5) * 2.0, vUv.y);
    float t = uTime * 7.0 + uSeed * 13.0;
    // Sway grows toward the tip, two frequencies so it never loops visibly.
    p.x += (sin(t + p.y * 4.5) * 0.16 + sin(t * 1.83 + p.y * 9.0) * 0.06) * p.y * p.y;
    // Teardrop: fat rounded base, pinched to a point at the top (reference
    // flames are nearly as wide as the candle itself).
    float taper = mix(0.5, 3.2, smoothstep(0.1, 1.0, p.y));
    float d = length(vec2(p.x * taper, (p.y - 0.33) * 1.4));
    float body = 1.0 - smoothstep(0.34, 0.62, d);
    float core = 1.0 - smoothstep(0.0, 0.34, d);
    float base = smoothstep(0.02, 0.12, p.y);
    body *= base;
    core *= base;
    vec3 color = mix(vec3(1.0, 0.52, 0.12), vec3(1.0, 0.98, 0.88), core);
    gl_FragColor = vec4(color * (1.0 + 1.1 * core), body * uLife);
  }
`

type CandlesProps = {
  phase: CakePhase
  /** Assembly clock start (scene elapsed seconds), null before the act. */
  startRef: RefObject<number | null>
  /** Movement-guarded tap on any candle — the parent decides blow vs relight. */
  onTapCandle: () => void
}

const CANDLE_RADIUS = 0.036

// Per-candle GPU resources live at module level (CANDLES is a module const),
// matching the project's shared-material convention — and letting useFrame
// mutate uniforms/opacities without touching hook-owned values.
// Flame quad anchored at its bottom so scaling reads as shrinking down.
const flameGeometry = new THREE.PlaneGeometry(0.2, 0.42)
flameGeometry.translate(0, 0.21, 0)
const flameMaterials = CANDLES.map(
  (_, index) =>
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uLife: { value: 0 },
        uSeed: { value: index * 3.7 },
      },
      vertexShader: FLAME_VERTEX,
      fragmentShader: FLAME_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
)
const haloMaterials = CANDLES.map(
  () =>
    new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    }),
)
const smokeMaterials = CANDLES.map(
  () =>
    new THREE.MeshBasicMaterial({
      map: smokeTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }),
)
const emberMaterials = CANDLES.map(
  () =>
    new THREE.MeshStandardMaterial({
      color: '#2c1b12',
      emissive: '#ff8a3c',
      emissiveIntensity: 0,
    }),
)
const tmpQuat = new THREE.Quaternion()

export function Candles({ phase, startRef, onTapCandle }: CandlesProps) {
  const part = useAssembleParts(startRef)

  const lit = useRef(new Float32Array(CANDLES.length))
  const litTarget = useRef(new Float32Array(CANDLES.length))
  const smokePending = useRef(new Array<boolean>(CANDLES.length).fill(false))
  const smokeAge = useRef(new Float32Array(CANDLES.length).fill(2))

  const billboards = useRef<Array<THREE.Group | null>>([])
  const flameMeshes = useRef<Array<THREE.Mesh | null>>([])
  const smokeMeshes = useRef<Array<THREE.Mesh | null>>([])
  const lightRef = useRef<THREE.PointLight>(null)

  // Phase → flame targets: ignite after assembly / relight, cascade on blow.
  useEffect(() => {
    const timeouts: number[] = []
    if (phase === 'lit' || phase === 'relit') {
      CANDLES.forEach((_, index) => {
        timeouts.push(
          window.setTimeout(() => {
            litTarget.current[index] = 1
          }, index * 110),
        )
      })
    } else if (phase === 'blowing') {
      CANDLES.forEach((_, index) => {
        timeouts.push(
          window.setTimeout(() => {
            litTarget.current[index] = 0
            smokePending.current[index] = true
          }, index * CASCADE_STEP_MS),
        )
      })
    }
    return () => timeouts.forEach((id) => window.clearTimeout(id))
  }, [phase])

  useEffect(() => {
    return () => {
      document.body.style.cursor = ''
    }
  }, [])

  useFrame(({ clock, camera }, delta) => {
    const time = clock.getElapsedTime()
    let glow = 0
    for (let i = 0; i < CANDLES.length; i += 1) {
      const target = litTarget.current[i]
      const current = lit.current[i]
      const stiffness = target > current ? 5 : 13
      const next = current + (target - current) * (1 - Math.exp(-stiffness * delta))
      lit.current[i] = next
      glow += next

      const material = flameMaterials[i]
      material.uniforms.uTime.value = time
      material.uniforms.uLife.value = next
      haloMaterials[i].opacity = 0.6 * next

      const flame = flameMeshes.current[i]
      if (flame) {
        flame.scale.set(0.45 + 0.55 * next, 0.2 + 0.8 * next, 1)
      }

      // Billboard the flame group toward the camera, honoring parent spin.
      const billboard = billboards.current[i]
      if (billboard?.parent) {
        billboard.parent.getWorldQuaternion(tmpQuat)
        billboard.quaternion.copy(tmpQuat.invert().multiply(camera.quaternion))
      }

      // Smoke wisp once the flame actually dies.
      if (smokePending.current[i] && next < 0.5) {
        smokePending.current[i] = false
        smokeAge.current[i] = 0
      }
      const smoke = smokeMeshes.current[i]
      if (smokeAge.current[i] < 1) {
        smokeAge.current[i] += delta / 1.7
        const age = Math.min(smokeAge.current[i], 1)
        smokeMaterials[i].opacity = 0.5 * (1 - age)
        emberMaterials[i].emissiveIntensity = Math.max(0, 1 - age * 2.2) * 2
        if (smoke) {
          smoke.position.y = 0.06 + age * 0.42
          smoke.scale.setScalar(0.5 + age * 1.1)
        }
      } else {
        smokeMaterials[i].opacity = 0
        emberMaterials[i].emissiveIntensity = 0
      }
    }

    if (lightRef.current) {
      const flicker =
        3.4 + Math.sin(time * 9.3) * 0.3 + Math.sin(time * 23.7) * 0.18
      lightRef.current.intensity = (glow / CANDLES.length) * flicker
    }
  })

  return (
    <group>
      <pointLight
        ref={lightRef}
        position={[0, CAKE_TOP_Y + 1.05, 0.12]}
        color="#f4d9a6"
        intensity={0}
        distance={7}
        decay={2}
      />
      {CANDLES.map((candle, index) => {
        const wickTop = candle.height + 0.05
        return (
          <group
            key={`candle-${index}`}
            position={[candle.x, candle.baseY, candle.z]}
            ref={part(`candle-${index}`, {
              delay: 1.3 + index * 0.09,
              duration: 0.5,
              drop: 0.3,
            })}
          >
            <mesh material={waxMaterials[candle.stripe]} position={[0, candle.height / 2, 0]}>
              <cylinderGeometry
                args={[CANDLE_RADIUS, CANDLE_RADIUS, candle.height, 16]}
              />
            </mesh>
            <mesh material={wickMaterial} position={[0, candle.height + 0.025, 0]}>
              <cylinderGeometry args={[0.007, 0.009, 0.06, 6]} />
            </mesh>
            <mesh material={emberMaterials[index]} position={[0, wickTop, 0]}>
              <sphereGeometry args={[0.011, 8, 8]} />
            </mesh>

            {/* Flame + halo + smoke, billboarded as one group */}
            <group
              position={[0, wickTop - 0.02, 0]}
              ref={(node) => {
                billboards.current[index] = node
              }}
            >
              <mesh
                geometry={flameGeometry}
                material={flameMaterials[index]}
                ref={(node) => {
                  flameMeshes.current[index] = node
                }}
              />
              <mesh material={haloMaterials[index]} position={[0, 0.16, 0]}>
                <planeGeometry args={[0.62, 0.62]} />
              </mesh>
              <mesh
                material={smokeMaterials[index]}
                position={[0, 0.06, 0]}
                ref={(node) => {
                  smokeMeshes.current[index] = node
                }}
              >
                <planeGeometry args={[0.2, 0.3]} />
              </mesh>
            </group>

            {/* Generous invisible tap target around the whole candle */}
            <mesh
              material={hitProxyMaterial}
              position={[0, candle.height / 2 + 0.12, 0]}
              onClick={(event) => {
                event.stopPropagation()
                if (event.delta < 8) {
                  onTapCandle()
                }
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                document.body.style.cursor = ''
              }}
            >
              <cylinderGeometry args={[0.16, 0.16, candle.height + 0.5, 8]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
