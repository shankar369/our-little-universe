import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Gesture + state model for The Book. All continuous values (drag progress,
 * pinch zoom, pointer parallax) live in a ref that the R3F scene reads per
 * frame — React only re-renders when a page turn actually commits.
 *
 * Gestures: one finger drags a page; two fingers pinch-zoom the book
 * (a pinch cancels any in-flight page drag); mouse wheel zooms on desktop.
 */

export type BookDrag = {
  /** Index of the sheet being dragged. */
  sheet: number
  /** Flip progress of that sheet, 0 = flat right, 1 = flat left. */
  progress: number
}

export type BookControlState = {
  turned: number
  drag: BookDrag | null
  /** User zoom multiplier, 1 = fitted. */
  zoom: number
  /** Normalized pointer position for parallax, both axes in [-1, 1]. */
  pointer: { x: number; y: number }
}

type Gesture = {
  id: number
  startX: number
  startY: number
  startTime: number
  /** 0 = undecided, 1 = flipping forward, -1 = flipping back. */
  direction: 0 | 1 | -1
}

type Pinch = {
  startDistance: number
  startZoom: number
}

const MIN_ZOOM = 1
const MAX_ZOOM = 2.6

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
}

export function useBookControls(totalSheets: number) {
  const [turned, setTurned] = useState(0)
  const stateRef = useRef<BookControlState>({
    turned: 0,
    drag: null,
    zoom: 1,
    pointer: { x: 0, y: 0 },
  })
  const gesture = useRef<Gesture | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<Pinch | null>(null)

  useEffect(() => {
    stateRef.current.turned = turned
  }, [turned])

  const next = useCallback(() => {
    setTurned((value) => Math.min(totalSheets, value + 1))
  }, [totalSheets])

  const prev = useCallback(() => {
    setTurned((value) => Math.max(0, value - 1))
  }, [])

  /** Back to the very beginning: the closed cover, fitted zoom. */
  const reset = useCallback(() => {
    setTurned(0)
    stateRef.current.drag = null
    stateRef.current.zoom = 1
  }, [])

  // Arrow keys turn pages too.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        next()
      } else if (event.key === 'ArrowLeft') {
        prev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [next, prev])

  const pinchDistance = useCallback(() => {
    const [a, b] = [...pointers.current.values()]
    return Math.hypot(b.x - a.x, b.y - a.y)
  }, [])

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      pointers.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      })

      if (pointers.current.size === 2) {
        // Second finger down → this is a pinch, not a page turn.
        gesture.current = null
        stateRef.current.drag = null
        pinch.current = {
          startDistance: pinchDistance(),
          startZoom: stateRef.current.zoom,
        }
        return
      }
      if (gesture.current || pointers.current.size > 1) {
        return
      }
      gesture.current = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startTime: performance.now(),
        direction: 0,
      }
    },
    [pinchDistance],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const state = stateRef.current
      state.pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      state.pointer.y = (event.clientY / window.innerHeight) * 2 - 1

      if (pointers.current.has(event.pointerId)) {
        pointers.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        })
      }

      if (pinch.current && pointers.current.size >= 2) {
        const distance = pinchDistance()
        if (pinch.current.startDistance > 0) {
          state.zoom = clampZoom(
            pinch.current.startZoom * (distance / pinch.current.startDistance),
          )
        }
        return
      }

      const active = gesture.current
      if (!active || event.pointerId !== active.id) {
        return
      }
      const dx = event.clientX - active.startX
      if (active.direction === 0) {
        if (Math.abs(dx) < 8) {
          return
        }
        active.direction = dx < 0 ? 1 : -1
      }

      // How far a finger travels for a full page turn.
      const span = Math.min(window.innerWidth * 0.34, 300)
      if (active.direction === 1) {
        if (state.turned >= totalSheets) {
          state.drag = null
          return
        }
        state.drag = {
          sheet: state.turned,
          progress: Math.min(1, Math.max(0, -dx / span)),
        }
      } else {
        if (state.turned <= 0) {
          state.drag = null
          return
        }
        state.drag = {
          sheet: state.turned - 1,
          progress: 1 - Math.min(1, Math.max(0, dx / span)),
        }
      }
    },
    [pinchDistance, totalSheets],
  )

  const releasePointer = useCallback((pointerId: number) => {
    pointers.current.delete(pointerId)
    if (pinch.current && pointers.current.size < 2) {
      pinch.current = null
    }
  }, [])

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      releasePointer(event.pointerId)

      const active = gesture.current
      if (!active || event.pointerId !== active.id) {
        return
      }
      const state = stateRef.current
      const drag = state.drag
      const dx = event.clientX - active.startX
      const elapsed = performance.now() - active.startTime
      gesture.current = null
      state.drag = null

      if (active.direction === 0) {
        // A clean tap: left third goes back, right third goes forward.
        if (elapsed < 350 && Math.abs(dx) < 8) {
          const t = event.clientX / window.innerWidth
          if (t > 0.62) {
            next()
          } else if (t < 0.38) {
            prev()
          }
        }
        return
      }

      const flick = elapsed < 240 && Math.abs(dx) > 36
      if (active.direction === 1 && drag && (drag.progress > 0.42 || flick)) {
        next()
      } else if (
        active.direction === -1 &&
        drag &&
        (drag.progress < 0.58 || flick)
      ) {
        prev()
      }
    },
    [next, prev, releasePointer],
  )

  const onPointerCancel = useCallback(
    (event: React.PointerEvent) => {
      releasePointer(event.pointerId)
      if (gesture.current?.id === event.pointerId) {
        gesture.current = null
        stateRef.current.drag = null
      }
    },
    [releasePointer],
  )

  const onWheel = useCallback((event: React.WheelEvent) => {
    const state = stateRef.current
    state.zoom = clampZoom(state.zoom * Math.exp(-event.deltaY * 0.0012))
  }, [])

  return {
    turned,
    next,
    prev,
    reset,
    stateRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onWheel,
    },
  }
}
