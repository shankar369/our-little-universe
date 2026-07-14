import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { mulberry32 } from './cakeLayout'

/**
 * Heart-shaped balloons released into the scene when the wish lands — real
 * 3D objects (puffy extruded hearts with glossy pastel skins and little
 * strings) rising around the cake with a slow wobble, lit by the same studio
 * environment, so they belong to the cake's world instead of floating on top
 * of it. All motion lives in useFrame refs.
 */

function buildHeartGeometry(): THREE.BufferGeometry {
  // The classic three.js heart outline (points down after the flip).
  const shape = new THREE.Shape()
  shape.moveTo(2.5, 2.5)
  shape.bezierCurveTo(2.5, 2.5, 2.0, 0, 0, 0)
  shape.bezierCurveTo(-3.0, 0, -3.0, 3.5, -3.0, 3.5)
  shape.bezierCurveTo(-3.0, 5.5, -1.0, 7.7, 2.5, 9.5)
  shape.bezierCurveTo(6.0, 7.7, 8.0, 5.5, 8.0, 3.5)
  shape.bezierCurveTo(8.0, 3.5, 8.0, 0, 5.0, 0)
  shape.bezierCurveTo(3.5, 0, 2.5, 2.5, 2.5, 2.5)

  // Modest bevel keeps the heart silhouette crisp while still puffing it.
  const extruded = new THREE.ExtrudeGeometry(shape, {
    depth: 1.3,
    bevelEnabled: true,
    bevelSegments: 7,
    bevelSize: 0.85,
    bevelThickness: 1.0,
    curveSegments: 28,
  })
  // Weld + recompute normals so the balloon reads smooth and inflated.
  // (uv/normal must go first or mergeVertices can't match seam vertices.)
  extruded.deleteAttribute('uv')
  extruded.deleteAttribute('normal')
  const welded = mergeVertices(extruded, 1e-4)
  extruded.dispose()
  welded.center()
  welded.rotateZ(Math.PI)
  welded.scale(0.058, 0.058, 0.058)
  welded.computeVertexNormals()
  return welded
}

const heartGeometry = buildHeartGeometry()

const balloonMaterials = ['#f294c5', '#b87ef2', '#eec27e'].map(
  (color) =>
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.14,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.92,
      envMapIntensity: 1.1,
    }),
)

const stringGeometry = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.035, -0.28, 0.01),
    new THREE.Vector3(-0.035, -0.56, -0.01),
    new THREE.Vector3(0.02, -0.82, 0),
  ]),
  16,
  0.006,
  5,
)
const stringMaterial = new THREE.MeshBasicMaterial({
  color: '#f5f0ff',
  transparent: true,
  opacity: 0.45,
})

type BalloonParams = {
  radius: number
  angle: number
  speed: number
  sway: number
  phase: number
  spin: number
  scale: number
  material: number
  delay: number
  /** Extra shift toward the camera so phones see balloons pass the cake. */
  zBias: number
}

type HeartBalloons3DProps = {
  /** True while balloons should fly; a fresh rise starts on each activation. */
  active: boolean
  compact: boolean
}

export function HeartBalloons3D({ active, compact }: HeartBalloons3DProps) {
  const count = 8
  const groups = useRef<Array<THREE.Group | null>>([])
  const startedAt = useRef(-1)

  // On phones the frustum is narrow, so the flight ring pulls in tight
  // around the cake — otherwise most balloons rise outside the frame.
  const params = useMemo<BalloonParams[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const rand = mulberry32(900 + i * 131)
        return {
          radius: compact ? 1.85 + rand() * 0.9 : 2.9 + rand() * 1.4,
          angle: (i / 8) * Math.PI * 2 + rand() * 0.6,
          speed: compact ? 0.7 + rand() * 0.45 : 0.6 + rand() * 0.4,
          sway: compact ? 0.16 + rand() * 0.2 : 0.25 + rand() * 0.3,
          phase: rand() * Math.PI * 2,
          spin: (rand() - 0.5) * 0.7,
          scale: compact ? 0.42 + rand() * 0.26 : 0.5 + rand() * 0.32,
          material: i % balloonMaterials.length,
          delay: rand() * 1.1,
          zBias: compact ? (i % 2 === 0 ? 1.4 : 0.5) : 0,
        }
      }),
    [compact],
  )

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (active && startedAt.current < 0) {
      startedAt.current = time
    } else if (!active) {
      startedAt.current = -1
    }
    for (let i = 0; i < count; i += 1) {
      const group = groups.current[i]
      if (!group) {
        continue
      }
      const start = startedAt.current
      const local = start < 0 ? -1 : time - start - params[i].delay
      if (local < 0) {
        group.visible = false
        continue
      }
      const p = params[i]
      // Balloons stream continuously while active: each one climbs the
      // visible band, slips out the top, and is reborn below.
      const cycle = 8.2 / p.speed + 0.8
      const phaseLocal = local % cycle
      const y = -0.7 + phaseLocal * p.speed
      if (y > 7.5) {
        group.visible = false
        continue
      }
      group.visible = true
      group.position.set(
        Math.cos(p.angle) * p.radius + Math.sin(local * 0.9 + p.phase) * p.sway,
        y,
        Math.sin(p.angle) * p.radius +
          p.zBias +
          Math.cos(local * 0.7 + p.phase) * p.sway * 0.6,
      )
      group.rotation.y = p.phase + local * p.spin
      group.rotation.z = Math.sin(local * 0.8 + p.phase) * 0.12
      const grow = Math.min(1, local / 0.8)
      group.scale.setScalar(p.scale * (0.6 + 0.4 * grow))
    }
  })

  return (
    <group>
      {params.slice(0, count).map((p, i) => (
        <group
          key={i}
          visible={false}
          ref={(node) => {
            groups.current[i] = node
          }}
        >
          <mesh geometry={heartGeometry} material={balloonMaterials[p.material]} />
          <mesh geometry={stringGeometry} material={stringMaterial} position={[0, -0.28, 0]} />
        </group>
      ))}
    </group>
  )
}
