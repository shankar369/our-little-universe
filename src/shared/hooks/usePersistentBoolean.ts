import { useCallback, useState } from 'react'
import { readBooleanStorage, writeBooleanStorage } from '../lib/storage'

export function usePersistentBoolean(key: string, initialValue = false) {
  const [value, setValue] = useState(() => readBooleanStorage(key, initialValue))

  const updateValue = useCallback(
    (nextValue: boolean) => {
      writeBooleanStorage(key, nextValue)
      setValue(nextValue)
    },
    [key],
  )

  return [value, updateValue] as const
}
