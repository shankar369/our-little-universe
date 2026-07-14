import { useEffect, useMemo, type RefObject } from 'react'
import { RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { CAKE_TOP_Y, TIERS, mulberry32 } from './cakeLayout'
import { buildDripCurtain, buildGlazeCap, buildPlate } from './dripGeometry'
import {
  makeCrumbTexture,
  makeFlameGlowTexture,
  makeNameTagTexture,
  makeShadowTexture,
} from './cakeTextures'
import { useAssembleParts } from './useAssembleParts'

/**
 * The cake itself, rebuilt against the bdaycake.com reference: three crumb-
 * textured sponge tiers wearing a sculpted midnight glaze (drip curtain +
 * domed cap per tier), an elegant lathe plate, a gold sparkler on the crown,
 * a warm-paper name tag, and pastel gifts. Everything
 * is procedural and lit purely by the scene's studio environment map.
 */

// ---------------------------------------------------------------------------
// Materials (module-level: built once, shared by every mesh)
// ---------------------------------------------------------------------------

const crumbTexture = makeCrumbTexture()
const shadowTexture = makeShadowTexture()

// Midnight Velvet palette translated into frosting: warm-cream sponge under a
// glossy blush-rose glaze, on a pale lavender plate.
const spongeMaterial = new THREE.MeshStandardMaterial({
  color: '#f9f2e4',
  map: crumbTexture,
  bumpMap: crumbTexture,
  bumpScale: 0.3,
  roughness: 0.96,
})
const glazeMaterial = new THREE.MeshPhysicalMaterial({
  color: '#e784ba',
  roughness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.18,
  envMapIntensity: 1,
  // The drip curtain's underside peeks out at grazing angles.
  side: THREE.DoubleSide,
})
const plateMaterial = new THREE.MeshPhysicalMaterial({
  color: '#e6e2f2',
  roughness: 0.1,
  clearcoat: 0.35,
  clearcoatRoughness: 0.2,
  envMapIntensity: 1,
  // The lathe profile winds outward-then-back; without this the plate's top
  // face is backface-culled and the cake looks sunk through a floating ring.
  side: THREE.DoubleSide,
})
const shadowMaterial = new THREE.MeshBasicMaterial({
  map: shadowTexture,
  transparent: true,
  depthWrite: false,
})
const paperMaterial = new THREE.MeshStandardMaterial({
  color: '#fff9f1',
  roughness: 0.85,
})
const sparklerGoldMaterial = new THREE.MeshStandardMaterial({
  color: '#f4d9a6',
  emissive: '#ffd98f',
  emissiveIntensity: 2.4,
  roughness: 0.3,
  metalness: 0.4,
})
const sparklerStickMaterial = new THREE.MeshStandardMaterial({
  color: '#d9cfc0',
  roughness: 0.6,
})
const sparklerGlowMaterial = new THREE.SpriteMaterial({
  map: makeFlameGlowTexture(),
  color: '#ffe9bd',
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
})

// Small companions nestled right against the plate rim, grounded by blob
// shadows — far enough to clear the dish, close enough to belong to it.
const GIFTS = [
  {
    position: [-2.2, 0, 0.8] as const,
    rotationY: 0.5,
    scale: 0.62,
    box: '#cdb9f7',
    ribbon: '#f7b8d4',
  },
  {
    position: [2.3, 0, 0.15] as const,
    rotationY: -0.45,
    scale: 0.5,
    box: '#f6c3d9',
    ribbon: '#f4d9a6',
  },
  {
    position: [-2.0, 0, -1.1] as const,
    rotationY: 0.9,
    scale: 0.42,
    box: '#b9c6f7',
    ribbon: '#f5f0ff',
  },
] as const

const giftMaterials = GIFTS.map((gift) => ({
  box: new THREE.MeshPhysicalMaterial({
    color: gift.box,
    roughness: 0.42,
    clearcoat: 0.25,
    envMapIntensity: 0.9,
  }),
  ribbon: new THREE.MeshPhysicalMaterial({
    color: gift.ribbon,
    roughness: 0.3,
    clearcoat: 0.45,
    envMapIntensity: 1,
  }),
}))

// ---------------------------------------------------------------------------
// Small procedural extras
// ---------------------------------------------------------------------------

/**
 * The starburst head of the sparkler: a two-shell burst — long fine rays
 * tapering outward plus a dense short core — reads as a burning sparkler
 * rather than a wire ball. An additive glow sprite breathes light into it.
 */
function buildSparklerGeometry(): THREE.BufferGeometry {
  const rand = mulberry32(77)
  const pieces: THREE.BufferGeometry[] = []
  const dir = new THREE.Vector3()
  const up = new THREE.Vector3(0, 1, 0)
  const quat = new THREE.Quaternion()
  const addRay = (length: number, thickness: number) => {
    // Taper to a point at the tip, like a burning ray.
    const piece = new THREE.CylinderGeometry(0.0012, thickness, length, 4)
    dir.set(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).normalize()
    quat.setFromUnitVectors(up, dir)
    piece.applyQuaternion(quat)
    piece.translate(dir.x * (length / 2), dir.y * (length / 2), dir.z * (length / 2))
    pieces.push(piece)
  }
  for (let i = 0; i < 20; i += 1) {
    addRay(0.14 + rand() * 0.13, 0.005 + rand() * 0.003)
  }
  for (let i = 0; i < 14; i += 1) {
    addRay(0.05 + rand() * 0.05, 0.009)
  }
  const merged = mergeGeometries(pieces) ?? new THREE.BufferGeometry()
  pieces.forEach((piece) => piece.dispose())
  return merged
}

type CakeModelProps = {
  /** Assembly clock start (scene elapsed seconds), null before the act. */
  startRef: RefObject<number | null>
  /** Name piped onto the warm-paper tag. */
  name: string
}

export function CakeModel({ startRef, name }: CakeModelProps) {
  const part = useAssembleParts(startRef)

  const geometry = useMemo(
    () => ({
      plate: buildPlate(),
      curtains: TIERS.map((tier, index) => buildDripCurtain(tier, 1013 + index * 977)),
      caps: TIERS.map((tier) => buildGlazeCap(tier)),
      sparkler: buildSparklerGeometry(),
    }),
    [],
  )
  useEffect(() => {
    return () => {
      geometry.plate.dispose()
      geometry.curtains.forEach((g) => g.dispose())
      geometry.caps.forEach((g) => g.dispose())
      geometry.sparkler.dispose()
    }
  }, [geometry])

  const nameTag = useMemo(() => makeNameTagTexture(name), [name])
  useEffect(() => () => nameTag.dispose(), [nameTag])

  return (
    <group>
      {/* Soft grounding shadow + the plate */}
      <mesh material={shadowMaterial} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[2.75, 48]} />
      </mesh>
      <group ref={part('plate', { delay: 0, duration: 0.65, drop: 0.4 })}>
        <mesh geometry={geometry.plate} material={plateMaterial} />
      </group>

      {/* Three sponge tiers, each wearing its glaze cap + drip curtain */}
      {TIERS.map((tier, index) => (
        <group
          key={`tier-${index}`}
          position={[0, tier.bottom, 0]}
          ref={part(`tier-${index}`, { delay: 0.2 + index * 0.24 })}
        >
          <mesh material={spongeMaterial} position={[0, tier.height / 2, 0]}>
            <cylinderGeometry args={[tier.radius, tier.radius, tier.height, 56]} />
          </mesh>
          <mesh material={glazeMaterial} geometry={geometry.caps[index]} />
          <mesh material={glazeMaterial} geometry={geometry.curtains[index]} />
        </group>
      ))}

      {/* The gold sparkler on the very top */}
      <group
        position={[0, CAKE_TOP_Y, 0]}
        ref={part('topper', { delay: 0.95, duration: 0.6, drop: 0.35 })}
      >
        <mesh material={sparklerStickMaterial} position={[0, 0.27, 0]}>
          <cylinderGeometry args={[0.011, 0.011, 0.54, 8]} />
        </mesh>
        <mesh
          material={sparklerGoldMaterial}
          geometry={geometry.sparkler}
          position={[0, 0.54, 0]}
        />
        <sprite material={sparklerGlowMaterial} position={[0, 0.54, 0]} scale={[0.5, 0.5, 1]} />
        <Sparkles
          count={26}
          position={[0, 0.54, 0]}
          scale={[0.55, 0.55, 0.55]}
          size={4}
          speed={0.65}
          color="#ffe2a8"
          opacity={0.95}
        />
      </group>

      {/* Her name tag: foot on the plate, shoulder resting on the drips */}
      <group
        position={[0, 0.055, 1.54]}
        rotation={[-0.31, 0, 0.02]}
        ref={part('name-tag', { delay: 1.12, duration: 0.6, drop: 0.3 })}
      >
        <RoundedBox
          args={[0.94, 0.52, 0.055]}
          radius={0.05}
          smoothness={4}
          material={paperMaterial}
          position={[0, 0.247, 0]}
        />
        <mesh position={[0, 0.247, 0.0305]}>
          <planeGeometry args={[0.86, 0.43]} />
          <meshBasicMaterial map={nameTag} transparent toneMapped={false} />
        </mesh>
      </group>

      {/* A few pastel gifts keeping the cake company */}
      {GIFTS.map((gift, index) => (
        <group
          key={`gift-${index}`}
          position={[gift.position[0], gift.position[1], gift.position[2]]}
          rotation={[0, gift.rotationY, 0]}
          scale={gift.scale}
          ref={part(`gift-${index}`, {
            delay: 1.22 + index * 0.12,
            duration: 0.55,
            drop: 0.45,
          })}
        >
          <mesh
            material={shadowMaterial}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.004, 0]}
          >
            <circleGeometry args={[0.62, 32]} />
          </mesh>
          <mesh material={giftMaterials[index].box} position={[0, 0.22, 0]}>
            <boxGeometry args={[0.52, 0.44, 0.52]} />
          </mesh>
          <mesh material={giftMaterials[index].box} position={[0, 0.45, 0]}>
            <boxGeometry args={[0.58, 0.09, 0.58]} />
          </mesh>
          <mesh material={giftMaterials[index].ribbon} position={[0, 0.25, 0]}>
            <boxGeometry args={[0.6, 0.51, 0.09]} />
          </mesh>
          <mesh material={giftMaterials[index].ribbon} position={[0, 0.25, 0]}>
            <boxGeometry args={[0.09, 0.51, 0.6]} />
          </mesh>
          <mesh
            material={giftMaterials[index].ribbon}
            position={[-0.045, 0.53, 0]}
            rotation={[0, 0, 0.7]}
          >
            <torusGeometry args={[0.05, 0.018, 7, 18]} />
          </mesh>
          <mesh
            material={giftMaterials[index].ribbon}
            position={[0.045, 0.53, 0]}
            rotation={[0, 0, -0.7]}
          >
            <torusGeometry args={[0.05, 0.018, 7, 18]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
