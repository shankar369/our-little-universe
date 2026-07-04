import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { museumContent } from '../../../content/museum'
import type { MuseumLayout } from '../museumLayout'
import type { MuseumInput } from '../useMuseumInput'
import type { MuseumPhase, PhotoSize } from '../museumTypes'
import { FirstPersonRig, type FocusTarget } from './FirstPersonRig'
import { PhotoFrame } from './PhotoFrame'
import { makeRunnerTexture, makeTextTexture } from './sceneTextures'

/**
 * The museum itself: a velvet-night gallery hall floating in the app's
 * constellation sky (the canvas is transparent — the ambient background IS
 * the outdoors). Procedural architecture, warm pooled lighting, double doors
 * that swing open after the password, and the photos of us on the walls.
 */

type GallerySceneProps = {
  photos: string[]
  layout: MuseumLayout
  phase: MuseumPhase
  input: MuseumInput
  focusedIndex: number | null
  onSelect: (index: number) => void
  onMeasured: (index: number, size: PhotoSize) => void
  photoSizes: React.RefObject<Record<number, PhotoSize>>
  onDollyDone: () => void
  onMissed: () => void
  compact: boolean
}

// ---------------------------------------------------------------------------
// Materials (module-level: built once, shared by every mesh)
// ---------------------------------------------------------------------------

const wallMaterial = new THREE.MeshStandardMaterial({
  color: '#221340',
  roughness: 0.92,
})
const endWallMaterial = new THREE.MeshStandardMaterial({
  color: '#1b0f33',
  roughness: 0.92,
})
const floorMaterial = new THREE.MeshStandardMaterial({
  color: '#120826',
  roughness: 0.34,
  metalness: 0.28,
})
const ceilingMaterial = new THREE.MeshStandardMaterial({
  color: '#150b28',
  roughness: 0.95,
})
const moldingMaterial = new THREE.MeshStandardMaterial({
  color: '#33205c',
  roughness: 0.7,
})
const doorMaterial = new THREE.MeshStandardMaterial({
  color: '#2b1550',
  roughness: 0.55,
  metalness: 0.15,
})
const doorTrimMaterial = new THREE.MeshStandardMaterial({
  color: '#c99a5c',
  metalness: 0.7,
  roughness: 0.35,
})
const handleMaterial = new THREE.MeshStandardMaterial({
  color: '#e8bd7f',
  metalness: 0.85,
  roughness: 0.3,
})
const stripMaterial = new THREE.MeshStandardMaterial({
  color: '#f4d9a6',
  emissive: '#f4d9a6',
  emissiveIntensity: 0.9,
})
const porchMaterial = new THREE.MeshStandardMaterial({
  color: '#170c2e',
  roughness: 0.5,
  metalness: 0.2,
})

const DOOR_WIDTH = 2.4
const DOOR_HEIGHT = 3.1

export function GalleryScene({
  photos,
  layout,
  phase,
  input,
  focusedIndex,
  onSelect,
  onMeasured,
  photoSizes,
  onDollyDone,
  onMissed,
  compact,
}: GallerySceneProps) {
  const focus = useMemo<FocusTarget | null>(() => {
    if (focusedIndex === null) {
      return null
    }
    const placement = layout.frames[focusedIndex]
    const size = photoSizes.current?.[focusedIndex] ?? { width: 1.5, height: 1.87 }
    return {
      index: focusedIndex,
      position: placement.position,
      normal: placement.normal,
      width: size.width,
      height: size.height,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex, layout])

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{
        fov: compact ? 70 : 62,
        near: 0.1,
        far: 90,
        position: layout.entranceCam,
      }}
      onPointerMissed={onMissed}
    >
      <FirstPersonRig
        layout={layout}
        phase={phase}
        input={input}
        focus={focus}
        onDollyDone={onDollyDone}
      />

      <ambientLight intensity={0.55} color="#8d7ab8" />
      <hemisphereLight args={['#9c86d4', '#0a0616', 0.65]} />
      <HallLights layout={layout} />

      <Hall layout={layout} />
      <Doors layout={layout} phase={phase} />
      <Facade layout={layout} />
      <Dedication layout={layout} />

      {photos.map((src, index) => (
        <PhotoFrame
          key={`${src}-${index}`}
          src={src}
          placement={layout.frames[index]}
          selectable={phase === 'inside' && focusedIndex === null}
          onSelect={onSelect}
          onMeasured={onMeasured}
        />
      ))}

      {/* Dust motes drifting through the lamplight */}
      <Sparkles
        count={compact ? 45 : 90}
        scale={[layout.width - 1, layout.height - 1, layout.length - 1]}
        position={[0, layout.height / 2, 0]}
        size={1.6}
        speed={0.25}
        color="#f4d9a6"
        opacity={0.5}
      />
    </Canvas>
  )
}

// ---------------------------------------------------------------------------
// Architecture
// ---------------------------------------------------------------------------

function Hall({ layout }: { layout: MuseumLayout }) {
  const { width, height, length, doorZ } = layout
  const halfW = width / 2
  const runner = useMemo(() => makeRunnerTexture(), [])
  const sideWallWidth = (width - DOOR_WIDTH) / 2

  return (
    <group>
      {/* Floor + runner carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[2.3, length - 1.6]} />
        <meshBasicMaterial
          map={runner}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, length]} />
        <primitive object={ceilingMaterial} attach="material" />
      </mesh>

      {/* Side walls */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-halfW, height / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[halfW, height / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>

      {/* Far wall */}
      <mesh position={[0, height / 2, -length / 2]}>
        <planeGeometry args={[width, height]} />
        <primitive object={endWallMaterial} attach="material" />
      </mesh>

      {/* Entrance wall around the doorway (interior face) */}
      <mesh
        rotation={[0, Math.PI, 0]}
        position={[-(DOOR_WIDTH / 2 + sideWallWidth / 2), height / 2, doorZ]}
      >
        <planeGeometry args={[sideWallWidth, height]} />
        <primitive object={endWallMaterial} attach="material" />
      </mesh>
      <mesh
        rotation={[0, Math.PI, 0]}
        position={[DOOR_WIDTH / 2 + sideWallWidth / 2, height / 2, doorZ]}
      >
        <planeGeometry args={[sideWallWidth, height]} />
        <primitive object={endWallMaterial} attach="material" />
      </mesh>
      <mesh
        rotation={[0, Math.PI, 0]}
        position={[0, DOOR_HEIGHT + (height - DOOR_HEIGHT) / 2, doorZ]}
      >
        <planeGeometry args={[DOOR_WIDTH, height - DOOR_HEIGHT]} />
        <primitive object={endWallMaterial} attach="material" />
      </mesh>

      {/* Base + crown moldings along the side walls */}
      {[-halfW + 0.05, halfW - 0.05].map((x) => (
        <group key={x}>
          <mesh material={moldingMaterial} position={[x, 0.14, 0]}>
            <boxGeometry args={[0.1, 0.28, length]} />
          </mesh>
          <mesh material={moldingMaterial} position={[x, height - 0.16, 0]}>
            <boxGeometry args={[0.1, 0.32, length]} />
          </mesh>
        </group>
      ))}

      {/* Ceiling light strips down the hall */}
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} material={stripMaterial} position={[x, height - 0.06, 0]}>
          <boxGeometry args={[0.14, 0.06, length - 3]} />
        </mesh>
      ))}
    </group>
  )
}

function HallLights({ layout }: { layout: MuseumLayout }) {
  const positions = useMemo(() => {
    const count = Math.max(2, Math.round(layout.length / 8))
    return Array.from({ length: count }, (_, index) => {
      const t = count === 1 ? 0.5 : index / (count - 1)
      return THREE.MathUtils.lerp(
        -layout.length / 2 + 3,
        layout.length / 2 - 3,
        t,
      )
    })
  }, [layout])

  return (
    <>
      {positions.map((z) => (
        <pointLight
          key={z}
          position={[0, layout.height - 0.7, z]}
          color="#f4d9a6"
          intensity={26}
          distance={15}
          decay={1.9}
        />
      ))}
      {/* Porch light over the entrance */}
      <pointLight
        position={[0, DOOR_HEIGHT + 0.6, layout.doorZ + 1.6]}
        color="#f4d9a6"
        intensity={30}
        distance={12}
        decay={1.8}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Doors + facade
// ---------------------------------------------------------------------------

function Doors({ layout, phase }: { layout: MuseumLayout; phase: MuseumPhase }) {
  const leftRef = useRef<THREE.Group>(null)
  const rightRef = useRef<THREE.Group>(null)
  const progress = useRef(0)

  useFrame((_, delta) => {
    const target = phase === 'entrance' ? 0 : 1
    progress.current = THREE.MathUtils.damp(progress.current, target, 2.2, delta)
    const angle = progress.current * THREE.MathUtils.degToRad(104)
    if (leftRef.current) {
      leftRef.current.rotation.y = -angle
    }
    if (rightRef.current) {
      rightRef.current.rotation.y = angle
    }
  })

  const panelWidth = DOOR_WIDTH / 2 - 0.02

  return (
    <group position={[0, 0, layout.doorZ]}>
      {/* Gold door trim */}
      <mesh material={doorTrimMaterial} position={[0, DOOR_HEIGHT + 0.06, 0]}>
        <boxGeometry args={[DOOR_WIDTH + 0.5, 0.16, 0.34]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          material={doorTrimMaterial}
          position={[side * (DOOR_WIDTH / 2 + 0.11), DOOR_HEIGHT / 2, 0]}
        >
          <boxGeometry args={[0.22, DOOR_HEIGHT + 0.1, 0.34]} />
        </mesh>
      ))}

      {/* Hinged panels — they swing inward when the museum opens */}
      <group ref={leftRef} position={[-DOOR_WIDTH / 2, 0, 0]}>
        <mesh material={doorMaterial} position={[panelWidth / 2, DOOR_HEIGHT / 2, 0]}>
          <boxGeometry args={[panelWidth, DOOR_HEIGHT, 0.09]} />
        </mesh>
        <mesh material={handleMaterial} position={[panelWidth - 0.14, 1.45, 0.1]}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
      </group>
      <group ref={rightRef} position={[DOOR_WIDTH / 2, 0, 0]}>
        <mesh material={doorMaterial} position={[-panelWidth / 2, DOOR_HEIGHT / 2, 0]}>
          <boxGeometry args={[panelWidth, DOOR_HEIGHT, 0.09]} />
        </mesh>
        <mesh material={handleMaterial} position={[-(panelWidth - 0.14), 1.45, 0.1]}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
      </group>
    </group>
  )
}

function Facade({ layout }: { layout: MuseumLayout }) {
  const title = useMemo(
    () =>
      makeTextTexture(museumContent.title, {
        font: '600 148px Fraunces, Georgia, serif',
        color: '#f5f0ff',
        glow: 'rgba(200,148,252,0.7)',
      }),
    [],
  )
  const { width, height, doorZ } = layout
  const sideWallWidth = (width - DOOR_WIDTH) / 2
  const titleWidth = 3.4

  return (
    <group>
      {/* Exterior face of the entrance wall */}
      <mesh position={[-(DOOR_WIDTH / 2 + sideWallWidth / 2), height / 2, doorZ + 0.02]}>
        <planeGeometry args={[sideWallWidth, height]} />
        <primitive object={endWallMaterial} attach="material" />
      </mesh>
      <mesh position={[DOOR_WIDTH / 2 + sideWallWidth / 2, height / 2, doorZ + 0.02]}>
        <planeGeometry args={[sideWallWidth, height]} />
        <primitive object={endWallMaterial} attach="material" />
      </mesh>
      <mesh position={[0, DOOR_HEIGHT + (height - DOOR_HEIGHT) / 2, doorZ + 0.02]}>
        <planeGeometry args={[DOOR_WIDTH, height - DOOR_HEIGHT]} />
        <primitive object={endWallMaterial} attach="material" />
      </mesh>

      {/* The name above the doors */}
      <mesh position={[0, DOOR_HEIGHT + 0.72, doorZ + 0.06]}>
        <planeGeometry args={[titleWidth, titleWidth / title.aspect]} />
        <meshBasicMaterial
          map={title.texture}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Porch lamps flanking the doors */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * (DOOR_WIDTH / 2 + 0.65), 2.2, doorZ + 0.12]}>
          <mesh material={lampGlobe}>
            <sphereGeometry args={[0.11, 14, 14]} />
          </mesh>
          <mesh material={doorTrimMaterial} position={[0, -0.2, -0.04]}>
            <boxGeometry args={[0.05, 0.3, 0.05]} />
          </mesh>
        </group>
      ))}

      {/* Porch platform */}
      <mesh material={porchMaterial} position={[0, -0.11, doorZ + 3.4]}>
        <boxGeometry args={[6.4, 0.22, 7.2]} />
      </mesh>
    </group>
  )
}

const lampGlobe = new THREE.MeshStandardMaterial({
  color: '#ffe9c4',
  emissive: '#f4d9a6',
  emissiveIntensity: 2.4,
})

function Dedication({ layout }: { layout: MuseumLayout }) {
  const line = useMemo(
    () =>
      makeTextTexture(museumContent.dedication, {
        font: 'italic 84px Parisienne, cursive',
        color: '#f7b8d4',
        glow: 'rgba(247,184,212,0.6)',
      }),
    [],
  )
  const heart = useMemo(
    () =>
      makeTextTexture('♥', {
        font: '600 120px Fraunces, Georgia, serif',
        color: '#f7b8d4',
        glow: 'rgba(247,184,212,0.75)',
      }),
    [],
  )
  const lineWidth = 4.6

  return (
    <group position={[0, 0, -layout.length / 2 + 0.05]}>
      <mesh position={[0, 2.5, 0]}>
        <planeGeometry args={[0.9, 0.9 / heart.aspect]} />
        <meshBasicMaterial
          map={heart.texture}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <planeGeometry args={[lineWidth, lineWidth / line.aspect]} />
        <meshBasicMaterial
          map={line.texture}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
