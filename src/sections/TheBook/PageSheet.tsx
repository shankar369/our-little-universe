import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HINGE_GAP, PAGE_HEIGHT, PAGE_WIDTH, SHEET_GAP } from './bookLayout'
import { makeFaceCanvas, type SheetFace } from './pageTextures'

/**
 * One sheet of the album: a plane hinged at the spiral rings, bent per-frame
 * into a gentle cardstock flex. The ring edge leads the flip and the free
 * edge lags behind, so mid-turn the page bows toward the reader like real
 * card. Front and back faces carry independent canvas textures (the back is
 * UV-mirrored so it reads correctly through the flip).
 */

const SEGMENTS = 30
/** Slight resting bow so open pages never look laser-flat. */
const REST_BOW = 0.09

// Shared per-frame integration buffers — useFrame callbacks run serially.
const curlX = new Float32Array(SEGMENTS + 1)
const curlZ = new Float32Array(SEGMENTS + 1)
const curlPhi = new Float32Array(SEGMENTS + 1)

// Shared placeholder shown while a face's canvas is still painting.
let blackTexture: THREE.CanvasTexture | null = null
function getBlackTexture() {
  if (!blackTexture) {
    const canvas = document.createElement('canvas')
    canvas.width = 8
    canvas.height = 8
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#0c0c10'
      ctx.fillRect(0, 0, 8, 8)
    }
    blackTexture = new THREE.CanvasTexture(canvas)
    blackTexture.colorSpace = THREE.SRGBColorSpace
  }
  return blackTexture
}

/** Paint a face canvas into a texture; black cardstock until it resolves. */
function useFaceTexture(face: SheetFace, active: boolean, mirrored: boolean) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const key = JSON.stringify(face)

  useEffect(() => {
    // Inactive sheets (far from the open spread) hold no texture, so a long
    // book never hoards GPU memory; the black placeholder shows instead.
    if (!active) {
      return
    }
    let disposed = false
    makeFaceCanvas(face).then((canvas) => {
      if (disposed) {
        return
      }
      const next = new THREE.CanvasTexture(canvas)
      next.colorSpace = THREE.SRGBColorSpace
      next.anisotropy = 8
      if (mirrored) {
        // BackSide rendering mirrors UVs; flip them back so the page reads.
        next.wrapS = THREE.RepeatWrapping
        next.repeat.x = -1
      }
      setTexture(next)
    })
    // Releasing on re-run/unmount clears the texture (disposed by the effect
    // below), so scrolling past a page frees it.
    return () => {
      disposed = true
      setTexture(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, active, mirrored])

  useEffect(() => () => texture?.dispose(), [texture])

  return texture ?? getBlackTexture()
}

type PageSheetProps = {
  index: number
  front: SheetFace
  back: SheetFace
  /** Covers are stiffer boards. */
  isCover?: boolean
  /** Textures mount only for sheets near the open spread. */
  active: boolean
  /** Live control state (turned count + drag), read per frame. */
  controls: React.RefObject<{
    turned: number
    drag: { sheet: number; progress: number } | null
  }>
}

export function PageSheet({
  index,
  front,
  back,
  isCover = false,
  active,
  controls,
}: PageSheetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const progress = useRef(0)
  const applied = useRef(-1)
  const appliedBow = useRef(-1)

  const width = isCover ? PAGE_WIDTH * 1.015 : PAGE_WIDTH
  const height = isCover ? PAGE_HEIGHT * 1.02 : PAGE_HEIGHT
  // Cardstock flexes a little; the cover boards barely at all.
  const stiffness = isCover ? 0.85 : 0.45

  // Front of a sheet is a right-hand page; back is a left-hand page.
  const frontTexture = useFaceTexture(front, active, false)
  const backTexture = useFaceTexture(back, active, true)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, SEGMENTS, 1)
    // Hinge at the rings: x runs HINGE_GAP..HINGE_GAP+width.
    geo.translate(width / 2 + HINGE_GAP, 0, 0)
    // Render the same triangles twice: front-side then back-side material.
    const indexCount = geo.index?.count ?? 0
    geo.clearGroups()
    geo.addGroup(0, indexCount, 0)
    geo.addGroup(0, indexCount, 1)
    return geo
  }, [width, height])
  useEffect(() => () => geometry.dispose(), [geometry])

  // Column index per vertex — the bend only varies along the page width.
  const columns = useMemo(() => {
    const position = geometry.attributes.position
    const map = new Uint16Array(position.count)
    for (let i = 0; i < position.count; i++) {
      map[i] = Math.round(((position.getX(i) - HINGE_GAP) / width) * SEGMENTS)
    }
    return map
  }, [geometry, width])

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        map: frontTexture,
        emissive: '#ffffff',
        emissiveMap: frontTexture,
        emissiveIntensity: 0.34,
        roughness: 0.88,
        metalness: 0.04,
        side: THREE.FrontSide,
      }),
      new THREE.MeshStandardMaterial({
        map: backTexture,
        emissive: '#ffffff',
        emissiveMap: backTexture,
        emissiveIntensity: 0.34,
        roughness: 0.88,
        metalness: 0.04,
        side: THREE.BackSide,
      }),
    ],
    [frontTexture, backTexture],
  )
  useEffect(
    () => () => materials.forEach((material) => material.dispose()),
    [materials],
  )

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) {
      return
    }
    const state = controls.current
    const drag = state.drag?.sheet === index ? state.drag : null
    const target = drag ? drag.progress : index < state.turned ? 1 : 0

    // Pages follow the finger tightly, and settle softly when released.
    const lambda = drag ? 24 : 5.2 + (index % 3) * 0.5
    progress.current = THREE.MathUtils.damp(progress.current, target, lambda, delta)
    if (Math.abs(progress.current - target) < 0.0004) {
      progress.current = target
    }

    // Stack position: unflipped sheets pile right, flipped sheets pile left.
    const p = progress.current
    mesh.position.z = THREE.MathUtils.lerp(-index * SHEET_GAP, index * SHEET_GAP, p)

    // Only the top leaf of each pile gets its natural sag; the ones pressed
    // beneath stay flat so the thin (SHEET_GAP) stack z-sorts cleanly instead
    // of the pages poking through one another.
    const depthInPile =
      p < 0.5 ? index - state.turned : state.turned - 1 - index
    const bowScale = depthInPile <= 0 ? 1 : 0

    if (p === applied.current && bowScale === appliedBow.current) {
      return
    }
    applied.current = p
    appliedBow.current = bowScale

    // The ring edge leads and the free edge lags; both meet at 0 and π.
    const spineAngle =
      Math.PI * THREE.MathUtils.lerp(Math.pow(p, 0.72), p, stiffness)
    const edgeAngle =
      Math.PI * THREE.MathUtils.lerp(Math.pow(p, 1.45), p, stiffness)
    const bow = REST_BOW * (1 - stiffness) * (1 - 2 * p) * bowScale

    // Integrate the page curve outward from the rings.
    const ds = width / SEGMENTS
    curlX[0] = Math.cos(spineAngle) * HINGE_GAP
    curlZ[0] = Math.sin(spineAngle) * HINGE_GAP
    for (let j = 0; j <= SEGMENTS; j++) {
      const t = j / SEGMENTS
      const wave = t * t * (3 - 2 * t)
      curlPhi[j] = spineAngle + (edgeAngle - spineAngle) * wave + bow * t
      if (j < SEGMENTS) {
        const mid = (j + 0.5) / SEGMENTS
        const midWave = mid * mid * (3 - 2 * mid)
        const midPhi =
          spineAngle + (edgeAngle - spineAngle) * midWave + bow * mid
        curlX[j + 1] = curlX[j] + Math.cos(midPhi) * ds
        curlZ[j + 1] = curlZ[j] + Math.sin(midPhi) * ds
      }
    }

    const liveGeometry = mesh.geometry as THREE.BufferGeometry
    const position = liveGeometry.attributes.position
    const normal = liveGeometry.attributes.normal
    for (let i = 0; i < position.count; i++) {
      const column = columns[i]
      position.setX(i, curlX[column])
      position.setZ(i, curlZ[column])
      normal.setXYZ(i, -Math.sin(curlPhi[column]), 0, Math.cos(curlPhi[column]))
    }
    position.needsUpdate = true
    normal.needsUpdate = true
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={materials}
      frustumCulled={false}
    />
  )
}
