import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { RevealPhotoItem } from '../../../content/types'
import { publicAssetPath } from '../../lib/assetPath'

const goldenAngle = Math.PI * (3 - Math.sqrt(5))

function createFallbackTexture(item: RevealPhotoItem, index: number) {
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
  context.fillStyle = 'rgba(94, 26, 134, 0.5)'
  context.save()
  context.translate(256, 268)
  context.scale(2.6, 2.6)
  context.beginPath()
  context.moveTo(0, 10)
  context.bezierCurveTo(-14, -2, -8, -16, 0, -8)
  context.bezierCurveTo(8, -16, 14, -2, 0, 10)
  context.closePath()
  context.fill()
  context.restore()

  // Caption
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = 'rgba(43, 16, 72, 0.9)'
  context.font = 'italic 600 42px Georgia, serif'
  const words = item.heading.split(' ')
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ')
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ')
  context.fillText(firstLine, 256, secondLine ? 420 : 444, 420)
  if (secondLine) {
    context.fillText(secondLine, 256, 472, 420)
  }

  context.font = '600 22px Arial, sans-serif'
  context.fillStyle = 'rgba(43, 16, 72, 0.5)'
  const label = (item.label ?? item.name).toUpperCase()
  context.fillText(label.split('').join('\u200a'), 256, 552, 420)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

function usePhotoTexture(item: RevealPhotoItem, index: number) {
  const fallbackTexture = useMemo(() => createFallbackTexture(item, index), [item, index])
  const [texture, setTexture] = useState<THREE.Texture>(fallbackTexture)

  useEffect(() => {
    let disposed = false
    const loader = new THREE.TextureLoader()

    loader.load(
      publicAssetPath(item.photo),
      (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose()
          return
        }

        loadedTexture.colorSpace = THREE.SRGBColorSpace
        loadedTexture.minFilter = THREE.LinearFilter
        loadedTexture.magFilter = THREE.LinearFilter
        setTexture(loadedTexture)
      },
      undefined,
      () => {
        if (!disposed) {
          setTexture(fallbackTexture)
        }
      },
    )

    return () => {
      disposed = true
    }
  }, [fallbackTexture, item.photo])

  return texture
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
  const scale = 0.58 + (index % 5) * 0.02

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    const nativeEvent = event.nativeEvent
    const start = pointerStartRef.current
    pointerStartRef.current = null

    if (!start) {
      return
    }

    const movement = Math.hypot(nativeEvent.clientX - start.x, nativeEvent.clientY - start.y)

    if (movement < 8) {
      event.stopPropagation()
      onOpenItem(index)
    }
  }

  useFrame(({ clock }) => {
    if (!cardRef.current) {
      return
    }

    // Each card breathes gently along its own rhythm.
    const bob = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.55 + index * 1.7) * 0.045
    cardRef.current.position.set(position.x, position.y + bob, position.z)
    cardRef.current.lookAt(camera.position)
  })

  return (
    <group ref={cardRef} position={position}>
      <mesh
        position={[0, 0, 0.04]}
        scale={[1.6 * scale, 1.9 * scale, 1]}
        onPointerDown={(event) => {
          const nativeEvent = event.nativeEvent as PointerEvent
          pointerStartRef.current = { x: nativeEvent.clientX, y: nativeEvent.clientY }
        }}
        onPointerUp={handlePointerUp}
        onClick={(event) => {
          event.stopPropagation()
          onOpenItem(index)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, -0.03]} scale={[scale, scale, 1]}>
        <planeGeometry args={[1.02, 1.26]} />
        <meshBasicMaterial color="#fff9f1" transparent opacity={0.94} />
      </mesh>
      <mesh
        scale={[0.94 * scale, 1.12 * scale, 1]}
        onPointerDown={(event) => {
          const nativeEvent = event.nativeEvent
          pointerStartRef.current = { x: nativeEvent.clientX, y: nativeEvent.clientY }
        }}
        onPointerUp={handlePointerUp}
        onClick={(event) => {
          event.stopPropagation()
          onOpenItem(index)
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        <planeGeometry args={[1, 1.18]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
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

  useFrame((_, delta) => {
    if (!reducedMotion && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.045
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00014) * 0.03
    }
  })

  return (
    <>
      {/* Far cards melt into the night instead of clipping harshly */}
      <fog attach="fog" args={['#0a0418', 8.5, 15.5]} />

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
        minDistance={5.4}
        maxDistance={12}
        rotateSpeed={0.55}
        zoomSpeed={0.75}
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
  radius = 3.85,
}: PhotoSphereProps<TItem>) {
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

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
        className="[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"
        camera={{ position: [0, 0.55, 9.2], fov: 45, near: 0.1, far: 100 }}
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
