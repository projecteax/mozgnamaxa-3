import { useState, useCallback } from 'react'
import { getRandomSuccessMessage } from '@/lib/success-messages'

export function useSuccessMessage() {
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [hasSetSuccessMessage, setHasSetSuccessMessage] = useState(false)

  const setSuccessMessageOnce = useCallback(() => {
    if (!hasSetSuccessMessage) {
      const message = getRandomSuccessMessage()
      setSuccessMessage(message)
      setHasSetSuccessMessage(true)
    }
  }, [hasSetSuccessMessage])

  const resetSuccessMessage = useCallback(() => {
    setSuccessMessage("")
    setHasSetSuccessMessage(false)
  }, [])

  return {
    successMessage,
    setSuccessMessageOnce,
    resetSuccessMessage,
    hasSetSuccessMessage
  }
}
