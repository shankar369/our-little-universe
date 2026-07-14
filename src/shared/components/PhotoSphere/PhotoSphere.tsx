import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { RevealPhotoItem } from '../../../content/types'
import { publicAssetPath } from '../../lib/assetPath'
import { queueTextureLoad } from '../../lib/textureLoadQueue'

const goldenAngle = Math.PI * (3 - Math.sqrt(5))

function createFallbackTexture(index: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 640
  const context = canvas.getContext('2d')

  if (!context) {
    return new THREE.CanvasTexture(canvas)
  }

  // Soft pastel sky
  const hue = (272 + index * 19) % 360
  const sky = context.createLinearGradient(0, 0, 256, 640)
  sky.addColorStop(0, `hsl(${hue} 70% 90%)`)
  sky.addColorStop(0.55, `hsl(${(hue + 26) % 360} 72% 84%)`)
  sky.addColorStop(1, 'hsl(40 80% 86%)')
  context.fillStyle = sky
  context.fillRect(0, 0, 512, 640)

  // Dreamy glow
  const glow = context.createRadialGradient(256, 250, 30, 256, 250, 300)
  glow.addColorStop(0, 'rgba(255,255,255,0.75)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, 512, 640)

  // Tiny stars
  context.fillStyle = 'rgba(255,255,255,0.85)'
  for (let i = 0; i < 26; i += 1) {
    const sx = (i * 97 + index * 53) % 512
    const sy = (i * 151 + index * 31) % 420
    const sr = 1 + ((i + index) % 3)
    context.beginPath()
    context.arc(sx, sy, sr, 0, Math.PI * 2)
    context.fill()
  }

  // Heart
  context.fillStyle = 'rgba(94, 26, 134, 0.45)'
  context.save()
  context.translate(256, 320)
  context.scale(3, 3)
  context.beginPath()
  context.moveTo(0, 10)
  context.bezierCurveTo(-14, -2, -8, -16, 0, -8)
  context.bezierCurveTo(8, -16, 14, -2, 0, 10)
  context.closePath()
  context.fill()
  context.restore()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

/** A shared soft radial halo, drawn once and reused behind every photo. */
const glowTexture = (() => {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const context = canvas.getContext('2d')

  if (context) {
    const gradient = context.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2,
    )
    gradient.addColorStop(0, 'rgba(255,255,255,0.95)')
    gradient.addColorStop(0.45, 'rgba(255,255,255,0.4)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
})()

function usePhotoTexture(item: RevealPhotoItem, index: number) {
  const fallbackTexture = useMemo(() => createFallbackTexture(index), [index])
  const [texture, setTexture] = useState<THREE.Texture>(fallbackTexture)

  useEffect(() => {
    const cancel = queueTextureLoad(
      publicAssetPath(item.photo),
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace
        loadedTexture.minFilter = THREE.LinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.anisotropy = 4
        setTexture(loadedTexture)
      },
      () => {
        setTexture(fallbackTexture)
      },
    )

    return cancel
  }, [fallbackTexture, item.photo])

  return texture
}

/** Natural aspect ratio (w/h) of a texture's image, with a portrait default. */
function textureAspect(texture: THREE.Texture): number {
  const image = texture.image as
    | { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number }
    | undefined

  if (!image) {
    return 0.8
  }

  const width = image.naturalWidth || image.width || 4
  const height = image.naturalHeight || image.height || 5
  return height ? width / height : 0.8
}

/**
 * A flat rounded-rectangle geometry in the XY plane, centered on the origin, with
 * UVs remapped to the bounding box so a photo texture maps edge-to-edge (the
 * default ShapeGeometry UVs use world coordinates and would distort the image).
 */
function createRoundedPhotoGeometry(width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2)
  const x = -width / 2
  const y = -height / 2
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + width - r, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + r)
  shape.lineTo(x + width, y + height - r)
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  shape.lineTo(x + r, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)

  const geometry = new THREE.ShapeGeometry(shape, 12)
  const position = geometry.attributes.position
  const uvs = new Float32Array(position.count * 2)
  for (let i = 0; i < position.count; i += 1) {
    uvs[i * 2] = (position.getX(i) + width / 2) / width
    uvs[i * 2 + 1] = (position.getY(i) + height / 2) / height
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  return geometry
}

function useRoundedPhotoGeometry(width: number, height: number, radius: number) {
  const geometry = useMemo(
    () => createRoundedPhotoGeometry(width, height, radius),
    [width, height, radius],
  )
  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

function spherePosition(index: number, count: number, radius: number) {
  const y = 1 - (index / Math.max(count - 1, 1)) * 2
  const radial = Math.sqrt(1 - y * y)
  const theta = goldenAngle * index

  return new THREE.Vector3(
    Math.cos(theta) * radial * radius,
    y * radius,
    Math.sin(theta) * radial * radius,
  )
}

type PhotoSphereCardProps<TItem extends RevealPhotoItem> = {
  item: TItem
  index: number
  count: number
  radius: number
  reducedMotion: boolean
  onOpenItem: (index: number) => void
}

function PhotoSphereCard<TItem extends RevealPhotoItem>({
  item,
  index,
  count,
  radius,
  reducedMotion,
  onOpenItem,
}: PhotoSphereCardProps<TItem>) {
  const cardRef = useRef<THREE.Group>(null)
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
  const { camera } = useThree()
  const texture = usePhotoTexture(item, index)
  const position = useMemo(() => spherePosition(index, count, radius), [count, index, radius])

  // Slight per-card size variety so the galaxy feels hand-placed, not gridded.
  const cardScale = 1.02 + (index % 5) * 0.035

  // Fit the photo inside a 1×1 box preserving its true aspect (no squishing).
  const aspect = useMemo(() => textureAspect(texture), [texture])
  const { photoWidth, photoHeight } = useMemo(() => {
    const box = 1
    return {
      photoWidth: aspect >= 1 ? box : box * aspect,
      photoHeight: aspect >= 1 ? box / aspect : box,
    }
  }, [aspect])

  const photoGeometry = useRoundedPhotoGeometry(photoWidth, photoHeight, 0.06)

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    const nativeEvent = event.nativeEvent
    pointerStartRef.current = { x: nativeEvent.clientX, y: nativeEvent.clientY }
  }

  // Open only on a genuine tap; a drag (rotating the galaxy) must never select.
  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    const nativeEvent = event.nativeEvent
    const start = pointerStartRef.current
    pointerStartRef.current = null

    if (!start) {
      return
    }

    const movement = Math.hypot(nativeEvent.clientX - start.x, nativeEvent.clientY - start.y)
    if (movement < 7) {
      event.stopPropagation()
      onOpenItem(index)
    }
  }

  useFrame(({ clock }) => {
    if (!cardRef.current) {
      return
    }

    // Each card breathes gently along its own rhythm.
    const bob = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.55 + index * 1.7) * 0.05
    cardRef.current.position.set(position.x, position.y + bob, position.z)
    cardRef.current.lookAt(camera.position)
  })

  return (
    <group ref={cardRef} position={position}>
      <group scale={cardScale}>
        {/* Soft luminous halo so each photo glows in the night */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[photoWidth + 0.55, photoHeight + 0.55]} />
          <meshBasicMaterial
            map={glowTexture}
            color="#e6d8ff"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* The photo — rounded, frameless, sized to its true aspect ratio */}
        <mesh geometry={photoGeometry}>
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {/* Invisible hit area; tap-vs-drag handled in the pointer logic above */}
        <mesh
          position={[0, 0, 0.02]}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            document.body.style.cursor = ''
          }}
        >
          <planeGeometry args={[photoWidth, photoHeight]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

type PhotoSphereSceneProps<TItem extends RevealPhotoItem> = {
  items: TItem[]
  onOpenItem: (index: number) => void
  radius: number
  reducedMotion: boolean
}

function PhotoSphereScene<TItem extends RevealPhotoItem>({
  items,
  onOpenItem,
  radius,
  reducedMotion,
}: PhotoSphereSceneProps<TItem>) {
  const groupRef = useRef<THREE.Group>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  useFrame((state, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.045
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00014) * 0.03
    }

    // Distance-aware fog: fade the far side of the sphere relative to the current
    // zoom, so zooming out never dissolves the whole galaxy into fog.
    const fog = state.scene.fog
    if (fog instanceof THREE.Fog) {
      const distance = state.camera.position.length()
      fog.near = distance - radius * 0.5
      fog.far = distance + radius * 1.9
    }
  })

  return (
    <>
      <fog attach="fog" args={['#0a0418', 6, 16]} />

      {/* Nebula heart at the center of the memory galaxy */}
      <mesh>
        <sphereGeometry args={[radius * 0.5, 32, 32]} />
        <meshBasicMaterial color="#6d28d9" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.26, 24, 24]} />
        <meshBasicMaterial color="#f7b8d4" transparent opacity={0.08} depthWrite={false} />
      </mesh>

      <Sparkles
        count={100}
        scale={radius * 2.5}
        size={2.4}
        speed={reducedMotion ? 0 : 0.28}
        opacity={0.5}
        color="#e9c8fc"
      />
      <Sparkles
        count={36}
        scale={radius * 1.4}
        size={3.4}
        speed={reducedMotion ? 0 : 0.18}
        opacity={0.4}
        color="#f4d9a6"
      />

      <group ref={groupRef}>
        {items.map((item, index) => (
          <PhotoSphereCard
            key={item.id}
            item={item}
            index={index}
            count={items.length}
            radius={radius}
            reducedMotion={reducedMotion}
            onOpenItem={onOpenItem}
          />
        ))}
      </group>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={4.6}
        maxDistance={26}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_ROTATE,
        }}
      />
    </>
  )
}

type PhotoSphereProps<TItem extends RevealPhotoItem> = {
  items: TItem[]
  onOpenItem: (index: number) => void
  className?: string
  radius?: number
}

export function PhotoSphere<TItem extends RevealPhotoItem>({
  items,
  onOpenItem,
  className = '',
  radius = 3.55,
}: PhotoSphereProps<TItem>) {
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // Narrow/portrait screens start further back so more of the galaxy is in frame.
  const initialDistance = useMemo(() => {
    const viewportAspect = window.innerWidth / Math.max(window.innerHeight, 1)
    if (viewportAspect < 0.65) {
      return 13
    }
    if (viewportAspect < 1) {
      return 11
    }
    return 9.5
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    function handleChange() {
      setReducedMotion(query.matches)
    }

    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  return (
    <div className={`relative ${className}`}>
      {/* Aura behind the galaxy so it floats in the page's night sky */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(109,40,217,0.28),rgba(247,184,212,0.08)_46%,transparent_72%)] blur-xl" />
      <Canvas
        className="[mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
        camera={{ position: [0, 0.3, initialDistance], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <PhotoSphereScene
          items={items}
          onOpenItem={onOpenItem}
          radius={radius}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}
