import { useEffect, useMemo, useRef } from 'react'

/**
 * First-person input for the museum, kept entirely in refs so nothing about
 * walking or looking ever re-renders React. The rig consumes these per frame.
 *
 * - Keyboard: WASD / arrow keys (desktop)
 * - Virtual joystick: MuseumHud writes into `stickRef` (mobile, and a
 *   clickable pad for mouse users who prefer it)
 * - Look: drag anywhere on the canvas (touch or mouse) accumulates deltas
 */

export type MoveVector = { x: number; y: number }

export type MuseumInput = {
  /** Keyboard movement vector: x strafe (+right), y walk (+forward). */
  keysRef: React.RefObject<MoveVector>
  /** Joystick movement vector, same axes. */
  stickRef: React.RefObject<MoveVector>
  /** Accumulated look deltas in px; the rig consumes and resets them. */
  lookRef: React.RefObject<{ dx: number; dy: number }>
  /** Pointer handlers to spread onto the canvas wrapper for drag-look. */
  lookHandlers: {
    onPointerDown: (event: React.PointerEvent) => void
    onPointerMove: (event: React.PointerEvent) => void
    onPointerUp: (event: React.PointerEvent) => void
    onPointerCancel: (event: React.PointerEvent) => void
  }
}

const KEY_MAP: Record<string, keyof KeyState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'back',
  ArrowDown: 'back',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

type KeyState = {
  forward: boolean
  back: boolean
  left: boolean
  right: boolean
}

export function useMuseumInput(enabled: boolean): MuseumInput {
  const keysRef = useRef<MoveVector>({ x: 0, y: 0 })
  const stickRef = useRef<MoveVector>({ x: 0, y: 0 })
  const lookRef = useRef({ dx: 0, dy: 0 })
  const keyState = useRef<KeyState>({
    forward: false,
    back: false,
    left: false,
    right: false,
  })
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null)

  useEffect(() => {
    const keys = keysRef.current
    if (!enabled) {
      keys.x = 0
      keys.y = 0
      return
    }

    function applyKeys() {
      const state = keyState.current
      keys.x = (state.right ? 1 : 0) - (state.left ? 1 : 0)
      keys.y = (state.forward ? 1 : 0) - (state.back ? 1 : 0)
    }

    function handleKey(event: KeyboardEvent, pressed: boolean) {
      const action = KEY_MAP[event.code]
      if (!action) {
        return
      }
      if (event.code.startsWith('Arrow')) {
        event.preventDefault()
      }
      keyState.current[action] = pressed
      applyKeys()
    }

    const down = (event: KeyboardEvent) => handleKey(event, true)
    const up = (event: KeyboardEvent) => handleKey(event, false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      keyState.current = { forward: false, back: false, left: false, right: false }
      keys.x = 0
      keys.y = 0
    }
  }, [enabled])

  const lookHandlers = useMemo(
    () => ({
      onPointerDown(event: React.PointerEvent) {
        if (pointer.current || event.button !== 0) {
          return
        }
        pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
      },
      onPointerMove(event: React.PointerEvent) {
        const active = pointer.current
        if (!active || active.id !== event.pointerId) {
          return
        }
        lookRef.current.dx += event.clientX - active.x
        lookRef.current.dy += event.clientY - active.y
        active.x = event.clientX
        active.y = event.clientY
      },
      onPointerUp(event: React.PointerEvent) {
        if (pointer.current?.id === event.pointerId) {
          pointer.current = null
        }
      },
      onPointerCancel(event: React.PointerEvent) {
        if (pointer.current?.id === event.pointerId) {
          pointer.current = null
        }
      },
    }),
    [],
  )

  return { keysRef, stickRef, lookRef, lookHandlers }
}
