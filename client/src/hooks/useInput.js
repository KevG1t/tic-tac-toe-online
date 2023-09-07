import { useState, useRef, useEffect } from 'react'

export function useInput () {
  const [value, updateValue] = useState('')
  const [error, setError] = useState(null)

  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = value === ''
      return
    }

    if (value === '') {
      setError('Complete el campo')
      return
    }

    setError(null)
  }, [value])

  return { value, updateValue, error }
}
