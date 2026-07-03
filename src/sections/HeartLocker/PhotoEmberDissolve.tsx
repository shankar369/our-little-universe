import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import {
  emberColors,
  emberScalars,
  makeEmberMaterial,
} from '../../shared/lib/emberGlsl'
import {
  sampleImageToPoints,
  type ImagePoints,
} from '../../shared/lib/pointSampling'

/**
 * The bridge between the filmstrip and the finale: the last polaroid's photo
 * dissolves out of its paper frame into embers that drift up toward the
 * signature. Fully scroll-scrubbed — scrolling back re-condenses the photo.
 *
 * Renders in its own thin overlay canvas ABOVE the act content (the ambience
 * canvas sits behind the cards, so its embers would be hidden by the very
 * polaroid that's burning). The DOM `<img>` crossfades inversely in
 * FilmstripAct.
 */

const GRID_DESKTOP: [number, number] = [45, 58] // ~2,600 embers
const GRID_COMPACT: [number, number] = [29, 38] // ~1,100 embers

type PhotoEmberDissolveProps = {
  src: string
  /** 0..1 over the last stretch of Act II. */
  progress: MotionValue<number>
  /** Viewport-space rect of the photo box, refreshed while Act II plays. */
  rect: RefObject<DOMRect | null>
  compact: boolean
}

const DISSOLVE_VERTEX = /* glsl */ `
  attribute vec2 aGrid;
  attribute vec3 aPixel;
  attribute vec3 aEmber;
  attribute vec3 aDrift;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPx;
  uniform float uDissolve;
  uniform vec2 uRectMin;
  uniform vec2 uRectSize;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    // Top rows lift first; a whisper of per-ember jitter keeps rows organic.
    float stagger = aGrid.y * 0.5 + fract(aSeed * 0.617) * 0.12;
    float local = smoothstep(stagger, stagger + 0.42, uDissolve);

    vec2 anchor = vec2(
      uRectMin.x + aGrid.x * uRectSize.x,
      uRectMin.y - aGrid.y * uRectSize.y
    );
    vec3 p = vec3(anchor, 0.0) + aDrift * local * local * (3.0 - 2.0 * local);
    p.x += sin(uTime * 1.5 + aSeed * 21.0) * 0.05 * local;
    p.y += cos(uTime * 1.8 + aSeed * 33.0) * 0.04 * local;

    // Embers light as they leave the photo and cool as they scatter away;
    // the fade is folded into vColor (additive blending dims with color).
    float appear = smoothstep(0.0, 0.12, local);
    float fade = 1.0 - smoothstep(0.72, 1.0, local);
    vColor = mix(aPixel, aEmber, min(local * 1.4, 0.75)) * appear * fade;
    vTwinkle = 0.75 + 0.25 * sin(uTime * 2.4 + aSeed * 47.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = aSize * (1.0 + local * 0.6) * uPx / max(-mv.z, 0.1);
    gl_Position = projectionMatrix * mv;
  }
`

/** Upward scatter offsets (world units): loose, high, and a little deep. */
function buildDriftTargets(count: number): Float32Array {
  const drift = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    drift[i * 3] = (Math.random() * 2 - 1) * 1.3
    drift[i * 3 + 1] = 1.2 + Math.random() * 2.2
    drift[i * 3 + 2] = (Math.random() * 2 - 1) * 0.5
  }
  return drift
}

export function PhotoEmberDissolve(props: PhotoEmberDissolveProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <DissolveScene {...props} />
      </Canvas>
    </div>
  )
}

function DissolveScene({
  src,
  progress,
  rect,
  compact,
}: PhotoEmberDissolveProps) {
  const { viewport, size } = useThree()
  const pointsRef = useRef<THREE.Points>(null)
  const [points, setPoints] = useState<ImagePoints | null>(null)
  const [cols, rows] = compact ? GRID_COMPACT : GRID_DESKTOP

  useEffect(() => {
    let active = true
    const image = new Image()
    image.decoding = 'async'
    image.src = src
    image
      .decode()
      .then(() => {
        if (active) {
          setPoints(sampleImageToPoints(image, cols, rows))
        }
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [src, cols, rows])

  const geometry = useMemo(() => {
    if (!points) {
      return null
    }
    const { count, coords, colors } = points
    const drift = buildDriftTargets(count)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('aGrid', new THREE.BufferAttribute(coords, 2))
    geo.setAttribute('aPixel', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('aEmber', new THREE.BufferAttribute(emberColors(count), 3))
    geo.setAttribute('aDrift', new THREE.BufferAttribute(drift, 3))
    geo.setAttribute(
      'aSize',
      new THREE.BufferAttribute(emberScalars(count, 0.03, 0.06), 1),
    )
    geo.setAttribute(
      'aSeed',
      new THREE.BufferAttribute(emberScalars(count, 0, 100), 1),
    )
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    )
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100)
    return geo
  }, [points])

  const material = useMemo(
    () =>
      makeEmberMaterial(DISSOLVE_VERTEX, {
        uDissolve: { value: 0 },
        uRectMin: { value: new THREE.Vector2() },
        uRectSize: { value: new THREE.Vector2(1, 1) },
      }),
    [],
  )

  useEffect(() => {
    if (geometry) {
      return () => geometry.dispose()
    }
  }, [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((state) => {
    const mesh = pointsRef.current
    const active = mesh?.material as THREE.ShaderMaterial | undefined
    if (!mesh || !active) {
      return
    }

    const dissolve = progress.get()
    const box = rect.current
    mesh.visible = dissolve > 0.001 && Boolean(box)
    if (!mesh.visible || !box) {
      return
    }

    // Viewport CSS px → world units at z = 0.
    const worldPerPx = viewport.height / size.height
    const u = active.uniforms
    u.uRectMin.value.set(
      (box.left - size.width / 2) * worldPerPx,
      (size.height / 2 - box.top) * worldPerPx,
    )
    u.uRectSize.value.set(box.width * worldPerPx, box.height * worldPerPx)
    u.uDissolve.value = dissolve
    u.uTime.value = state.clock.elapsedTime
    u.uPx.value = size.height / (2 * Math.tan((50 * Math.PI) / 360))
    u.uAlpha.value = 1
  })

  if (!geometry) {
    return null
  }

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  )
}
