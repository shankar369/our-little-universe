import * as THREE from 'three'

/**
 * Concurrency-limited texture loading. Sphere-style galleries mount every card
 * at once (dozens of items), and firing that many simultaneous image decodes
 * stalls the main thread and floods the network. This funnels loads through a
 * small shared pool so only a handful run at a time; everyone else queues.
 */
const MAX_CONCURRENT_LOADS = 4

const loader = new THREE.TextureLoader()
const queue: Array<() => void> = []
let active = 0

function runNext() {
  if (active >= MAX_CONCURRENT_LOADS) {
    return
  }
  const job = queue.shift()
  if (!job) {
    return
  }
  active += 1
  job()
}

export function queueTextureLoad(
  url: string,
  onLoad: (texture: THREE.Texture) => void,
  onError: () => void,
): () => void {
  let cancelled = false

  const job = () => {
    if (cancelled) {
      active -= 1
      runNext()
      return
    }

    loader.load(
      url,
      (texture) => {
        active -= 1
        if (!cancelled) {
          onLoad(texture)
        } else {
          texture.dispose()
        }
        runNext()
      },
      undefined,
      () => {
        active -= 1
        if (!cancelled) {
          onError()
        }
        runNext()
      },
    )
  }

  queue.push(job)
  runNext()

  return () => {
    cancelled = true
    const pendingIndex = queue.indexOf(job)
    if (pendingIndex !== -1) {
      queue.splice(pendingIndex, 1)
    }
  }
}
