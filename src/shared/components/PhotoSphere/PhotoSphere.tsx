import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { RevealPhotoItem } from '../../../content/types'

const goldenAngle = Math.PI * (3 - Math.sqrt(5))

function createFallbackTexture(item: RevealPhotoItem, index: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 640
  const context = canvas.getContext('2d')

  if (!context) {
    return new THREE.CanvasTexture(canvas)
  }

  const hue = (285 + index * 17) % 360
  const gradient = context.createLinearGradient(0, 0, 512, 640)
  gradient.addColorStop(0, `hsl(${hue} 85% 88%)`)
  gradient.addColorStop(0.46, `hsl(${(hue + 28) % 360} 84% 80%)`)
  gradient.addColorStop(1, 'hsl(43 92% 78%)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 512, 640)

  context.fillStyle = 'rgba(255,255,255,0.28)'
  context.fillRect(30, 30, 452, 580)
  context.fillStyle = 'rgba(41, 10, 70, 0.2)'
  context.fillRect(52, 54, 408, 462)

  context.fillStyle = 'rgba(42, 7, 69, 0.92)'
  context.font = '800 44px Inter, Arial, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  const words = item.heading.split(' ')
  const firstLine = words.slice(0, Math.ceil(words.length / 2)).join(' ')
  const secondLine = words.slice(Math.ceil(words.length / 2)).join(' ')
  context.fillText(firstLine, 256, 248, 360)
  if (secondLine) {
    context.fillText(secondLine, 256, 302, 360)
  }

  context.font = '700 24px Inter, Arial, sans-serif'
  context.fillStyle = 'rgba(42, 7, 69, 0.58)'
  context.fillText(item.label ?? item.name, 256, 555, 380)

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
      item.photo,
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
  onOpenItem: (index: number) => void
}

function PhotoSphereCard<TItem extends RevealPhotoItem>({
  item,
  index,
  count,
  radius,
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

  useFrame(() => {
    cardRef.current?.lookAt(camera.position)
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
      <mesh position={[0, 0, -0.035]} scale={[1.08 * scale, 1.34 * scale, 1]}>
        <planeGeometry args={[1.06, 1.34]} />
        <meshBasicMaterial color="#fff4fb" transparent opacity={0.95} />
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
      groupRef.current.rotation.y += delta * 0.055
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00016) * 0.035
    }
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.7} />
      <pointLight position={[3, 4, 5]} intensity={12} color="#f5d0fe" />
      <pointLight position={[-5, -2, -3]} intensity={8} color="#fde68a" />
      <Stars
        radius={18}
        depth={18}
        count={240}
        factor={3.2}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.22}
      />
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[radius * 0.58, 48, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.055} wireframe />
        </mesh>
        {items.map((item, index) => (
          <PhotoSphereCard
            key={item.id}
            item={item}
            index={index}
            count={items.length}
            radius={radius}
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
    <div
      className={`relative overflow-hidden rounded-[2.4rem] border border-white/14 bg-black/22 shadow-[0_32px_120px_rgba(0,0,0,0.55)] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 z-10 rounded-[2.4rem] bg-[radial-gradient(circle_at_50%_28%,rgba(240,171,252,0.22),transparent_34%),radial-gradient(circle_at_48%_72%,rgba(253,230,138,0.14),transparent_34%)]" />
      <Canvas
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
