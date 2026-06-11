export function readBooleanStorage(key: string, fallback = false) {
  if (typeof window === 'undefined') {
    return fallback
  }

  return window.localStorage.getItem(key) === 'true'
}

export function writeBooleanStorage(key: string, value: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(key, String(value))
}
