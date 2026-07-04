import { useEffect, useMemo, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import type { FramePlacement } from '../museumLayout'
import type { PhotoSize } from '../museumTypes'
import { makeGlowTexture } from './sceneTextures'

/**
 * One exhibit: a gold gallery frame with a warm-paper mat, the photo itself
 * (unlit so its colours stay true), a brass picture-light above pooling fake
 * light down the wall, and a little plaque beneath. Hover warms the frame;
 * click hands the visitor to the rig for the immersive glide.
 */

const MAX_PHOTO_WIDTH = 2.05
const MAX_PHOTO_HEIGHT = 1.9

// Shared across every frame — built once per session.
let sharedGlow: THREE.CanvasTexture | null = null
function glowTexture() {
  sharedGlow ??= makeGlowTexture()
  return sharedGlow
}

const frameGold = new THREE.MeshStandardMaterial({
  color: '#c99a5c',
  metalness: 0.75,
  roughness: 0.32,
})
const frameGoldHover = new THREE.MeshStandardMaterial({
  color: '#e8bd7f',
  metalness: 0.7,
  roughness: 0.26,
  emissive: '#8a6428',
  emissiveIntensity: 0.35,
})
const matPaper = new THREE.MeshStandardMaterial({
  color: '#f7f0e6',
  roughness: 0.9,
})
const plaqueBrass = new THREE.MeshStandardMaterial({
  color: '#a8834e',
  metalness: 0.8,
  roughness: 0.4,
})
const lampBrass = new THREE.MeshStandardMaterial({
  color: '#8a6a3c',
  metalness: 0.85,
  roughness: 0.35,
})
const lampGlow = new THREE.MeshStandardMaterial({
  color: '#f4d9a6',
  emissive: '#f4d9a6',
  emissiveIntensity: 1.6,
})

type PhotoFrameProps = {
  src: string
  placement: FramePlacement
  selectable: boolean
  onSelect: (index: number) => void
  onMeasured: (index: number, size: PhotoSize) => void
}

export function PhotoFrame({
  src,
  placement,
  selectable,
  onSelect,
  onMeasured,
}: PhotoFrameProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    let disposed = false
    const loader = new THREE.TextureLoader()

    loader.load(src, (loaded) => {
      if (disposed) {
        loaded.dispose()
        return
      }
      loaded.colorSpace = THREE.SRGBColorSpace
      loaded.anisotropy = 8
      setTexture(loaded)
    })

    return () => {
      disposed = true
    }
  }, [src])

  useEffect(() => () => texture?.dispose(), [texture])

  const size = useMemo<PhotoSize>(() => {
    const image = texture?.image as { width: number; height: number } | undefined
    const aspect = image && image.height > 0 ? image.width / image.height : 0.8
    const width = Math.min(MAX_PHOTO_WIDTH, MAX_PHOTO_HEIGHT * aspect)
    return { width, height: width / aspect }
  }, [texture])

  useEffect(() => {
    if (texture) {
      onMeasured(placement.index, size)
    }
  }, [texture, size, placement.index, onMeasured])

  useEffect(() => {
    document.body.style.cursor = hovered && selectable ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered, selectable])

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation()
    // A look-drag that ends on the frame is not a tap.
    if (selectable && event.delta < 8) {
      onSelect(placement.index)
    }
  }

  const { width, height } = size

  return (
    <group position={placement.position} rotation={[0, placement.rotationY, 0]}>
      {/* Light pooling on the wall around the exhibit */}
      <mesh position={[0, 0.25, -0.045]}>
        <planeGeometry args={[width + 2.1, height + 2.5]} />
        <meshBasicMaterial
          map={glowTexture()}
          transparent
          opacity={hovered && selectable ? 0.95 : 0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Gold frame → warm mat → the photo */}
      <mesh
        material={hovered && selectable ? frameGoldHover : frameGold}
        onClick={handleClick}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[width + 0.22, height + 0.22, 0.07]} />
      </mesh>
      <mesh material={matPaper} position={[0, 0, 0.012]}>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.055]} />
      </mesh>
      {texture ? (
        <mesh position={[0, 0, 0.043]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      ) : null}

      {/* Brass picture light above */}
      <mesh
        material={lampBrass}
        position={[0, height / 2 + 0.3, 0.1]}
        rotation={[0.5, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[0.035, 0.035, Math.min(width * 0.7, 1.2), 10]} />
      </mesh>
      <mesh material={lampGlow} position={[0, height / 2 + 0.26, 0.13]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[Math.min(width * 0.7, 1.2) - 0.06, 0.02, 0.05]} />
      </mesh>

      {/* Plaque */}
      <mesh material={plaqueBrass} position={[0, -height / 2 - 0.28, 0.01]}>
        <boxGeometry args={[0.42, 0.12, 0.02]} />
      </mesh>
    </group>
  )
}
