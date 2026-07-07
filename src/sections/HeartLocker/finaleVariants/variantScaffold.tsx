import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'motion/react'
import {
  beatChurn,
  buildFinaleTargets,
  buildPointsGeometry,
  finaleBeats,
  FINALE_CAMERA_Z,
  FINALE_FOV,
  paletteColors,
  pxFactor,
  randomScalars,
  useFontReady,
  type FinaleTargets,
  type FinaleVariantProps,
  type VariantFont,
} from './finaleEngine'
import { HeroRig } from './HeroRig'

/**
 * The chassis every finale variant rides on: identical scroll choreography,
 * identical uniforms/attributes, identical lifecycles — a variant supplies
 * its typeface, particle budget, palette, size ranges, and the shaders that
 * give it a soul. Every variant stays a standalone component with the same
 * interface as FinaleEmbers, so any one can drop straight into FinaleAct.
 *
 * Blending: instead of one global mix, every particle gets its own staggered
 * departure and arrival plus a curved personal arc between shapes (the
 * FIELD_BLEND / HERO_BLEND snippets) — letters sharpen progressively rather
 * than arriving as one jelly.
 *
 * Standard uniforms: uForm, uAsh, uLine (field) / uForm, uMorph (hero),
 *                    uTime, uPx, uAlpha, uChurn
 * Standard attributes:
 *   field: aWord, aScatter, aAsh, aLine, aColor, aSize, aSeed, aRow
 *   hero:  aN, aS, aScatter, aColor, aSize, aSeed, aRow
 */

export const FIELD_HEADER = /* glsl */ `
  attribute vec3 aWord;
  attribute vec3 aScatter;
  attribute vec3 aAsh;
  attribute vec3 aLine;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  attribute float aRow;
  attribute float aMember;
  uniform float uForm;
  uniform float uAsh;
  uniform float uLine;
  uniform float uTime;
  uniform float uPx;
  uniform float uChurn;
  varying vec3 vColor;
  varying float vTwinkle;
`

export const HERO_HEADER = /* glsl */ `
  attribute vec3 aN;
  attribute vec3 aS;
  attribute vec3 aScatter;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aSeed;
  attribute float aRow;
  uniform float uForm;
  uniform float uMorph;
  uniform float uLine;
  uniform float uTime;
  uniform float uPx;
  uniform float uChurn;
  varying vec3 vColor;
  varying float vTwinkle;
`

export const FIELD_BLEND = /* glsl */ `
  float stagger = fract(aSeed * 0.437) * 0.42;
  float formLocal = smoothstep(stagger, stagger + 0.58, uForm);
  float ashLocal = smoothstep(stagger * 0.5, stagger * 0.5 + 0.62, uAsh);
  float lineLocal = smoothstep(stagger * 0.55, stagger * 0.55 + 0.55, uLine);
  vec3 p = mix(aScatter, aWord, formLocal);
  p = mix(p, aAsh, ashLocal);
  p = mix(p, aLine, lineLocal);
  // Every traveller takes its own gentle arc between shapes.
  float transit = sin(formLocal * 3.14159) + sin(ashLocal * 3.14159) + sin(lineLocal * 3.14159);
  p.x += sin(aSeed * 6.2831) * transit * 0.34;
  p.y += cos(aSeed * 4.7124) * transit * 0.27;
`

export const HERO_BLEND = /* glsl */ `
  float stagger = fract(aSeed * 0.437) * 0.42;
  float formLocal = smoothstep(stagger, stagger + 0.58, uForm);
  float morphLocal = smoothstep(stagger * 0.6, stagger * 0.6 + 0.55, uMorph);
  vec3 p = mix(aScatter, aN, formLocal);
  p = mix(p, aS, morphLocal);
  float transit = sin(formLocal * 3.14159) + sin(morphLocal * 3.14159);
  p.x += sin(aSeed * 6.2831) * transit * 0.3;
  p.y += cos(aSeed * 4.7124) * transit * 0.24;
`

export const POINT_OUT = /* glsl */ `
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * vTwinkle * uPx / max(-mv.z, 0.1);
  gl_Position = projectionMatrix * mv;
`

export type VariantConfig = {
  font: VariantFont
  /** Particle budgets at density 1 (production). */
  heroCount: number
  fieldCount: number
  palette: string[]
  glowRange?: [number, number]
  fieldSize: [number, number]
  heroSize: [number, number]
  fieldVertex: string
  heroVertex: string
  fragment: string
  /** Extra scene layers (e.g. constellation lines). */
  extras?: (targets: FinaleTargets, progress: MotionValue<number>) => ReactNode
}

function makeMaterial(
  vertexShader: string,
  fragmentShader: string,
  extraUniforms: Record<string, THREE.IUniform>,
): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uForm: { value: 0 },
      uTime: { value: 0 },
      uPx: { value: 800 },
      uAlpha: { value: 0 },
      uChurn: { value: 0 },
      ...extraUniforms,
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.CustomBlending,
  })
  // Add light, never occlude — matches the shared ember material.
  material.blendEquation = THREE.AddEquation
  material.blendSrc = THREE.SrcAlphaFactor
  material.blendDst = THREE.OneFactor
  material.blendEquationAlpha = THREE.AddEquation
  material.blendSrcAlpha = THREE.ZeroFactor
  material.blendDstAlpha = THREE.OneFactor
  return material
}

// eslint-disable-next-line react-refresh/only-export-components
function VariantScene({
  progress,
  density,
  config,
}: FinaleVariantProps & { config: VariantConfig }) {
  const { viewport, size } = useThree()
  const fontReady = useFontReady(config.font.loadSpec)
  const fieldRef = useRef<THREE.Points>(null)
  const heroRef = useRef<THREE.Points>(null)

  const heroCount = Math.max(200, Math.round(config.heroCount * (density ?? 1)))
  const fieldCount = Math.max(500, Math.round(config.fieldCount * (density ?? 1)))

  const targets = useMemo(
    () =>
      buildFinaleTargets(
        viewport.width,
        viewport.height,
        config.font,
        fontReady,
        heroCount,
        fieldCount,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewport.width, viewport.height, fontReady, heroCount, fieldCount],
  )

  const glow = config.glowRange ?? [0.75, 1.2]

  const fieldGeometry = useMemo(() => {
    if (!targets) {
      return null
    }
    return buildPointsGeometry(fieldCount, {
      aWord: { array: targets.fieldWord, itemSize: 3 },
      aScatter: { array: targets.fieldScatter, itemSize: 3 },
      aAsh: { array: targets.fieldAsh, itemSize: 3 },
      aLine: { array: targets.fieldLine, itemSize: 3 },
      aColor: { array: paletteColors(fieldCount, config.palette, ...glow), itemSize: 3 },
      aSize: { array: randomScalars(fieldCount, ...config.fieldSize), itemSize: 1 },
      aSeed: { array: randomScalars(fieldCount, 0, 100), itemSize: 1 },
      aRow: { array: targets.fieldRow, itemSize: 1 },
      aMember: { array: targets.fieldMember, itemSize: 1 },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, fieldCount])

  const heroGeometry = useMemo(() => {
    if (!targets) {
      return null
    }
    return buildPointsGeometry(heroCount, {
      aN: { array: targets.heroN, itemSize: 3 },
      aS: { array: targets.heroS, itemSize: 3 },
      aScatter: { array: targets.heroScatter, itemSize: 3 },
      aColor: { array: paletteColors(heroCount, config.palette, ...glow), itemSize: 3 },
      aSize: { array: randomScalars(heroCount, ...config.heroSize), itemSize: 1 },
      aSeed: { array: randomScalars(heroCount, 0, 100), itemSize: 1 },
      aRow: { array: targets.heroRow, itemSize: 1 },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targets, heroCount])

  const fieldMaterial = useMemo(
    () =>
      makeMaterial(config.fieldVertex, config.fragment, {
        uAsh: { value: 0 },
        uLine: { value: 0 },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const heroMaterial = useMemo(
    () =>
      makeMaterial(config.heroVertex, config.fragment, {
        uMorph: { value: 0 },
        uLine: { value: 0 },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    return () => {
      fieldGeometry?.dispose()
      heroGeometry?.dispose()
    }
  }, [fieldGeometry, heroGeometry])
  useEffect(() => {
    return () => {
      fieldMaterial.dispose()
      heroMaterial.dispose()
    }
  }, [fieldMaterial, heroMaterial])

  useFrame((state) => {
    if (!targets) {
      return
    }
    const time = state.clock.elapsedTime
    const beats = finaleBeats(progress.get())
    const churn = beatChurn(beats)
    const px = pxFactor(size.height)

    const field = fieldRef.current?.material as THREE.ShaderMaterial | undefined
    if (field) {
      field.uniforms.uTime.value = time
      field.uniforms.uPx.value = px
      field.uniforms.uAlpha.value = beats.appear
      field.uniforms.uForm.value = beats.form
      field.uniforms.uAsh.value = beats.ash
      field.uniforms.uLine.value = beats.line
      field.uniforms.uChurn.value = churn
    }

    const hero = heroRef.current?.material as THREE.ShaderMaterial | undefined
    if (hero) {
      hero.uniforms.uTime.value = time
      hero.uniforms.uPx.value = px
      hero.uniforms.uAlpha.value = beats.appear
      hero.uniforms.uForm.value = beats.form
      hero.uniforms.uMorph.value = beats.morph
      hero.uniforms.uLine.value = beats.line
      hero.uniforms.uChurn.value = churn
    }
  })

  if (!targets || !fieldGeometry || !heroGeometry) {
    return null
  }

  return (
    <>
      <points
        ref={fieldRef}
        geometry={fieldGeometry}
        material={fieldMaterial}
        frustumCulled={false}
      />
      <HeroRig targets={targets} progress={progress}>
        <points
          ref={heroRef}
          geometry={heroGeometry}
          material={heroMaterial}
          frustumCulled={false}
        />
      </HeroRig>
      {config.extras?.(targets, progress)}
    </>
  )
}

/** Build a standalone finale-variant component from a config. */
export function createFinaleVariant(config: VariantConfig) {
  return function FinaleVariant({ progress, density }: FinaleVariantProps) {
    return (
      <Canvas
        camera={{ position: [0, 0, FINALE_CAMERA_Z], fov: FINALE_FOV, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <VariantScene progress={progress} density={density} config={config} />
      </Canvas>
    )
  }
}
