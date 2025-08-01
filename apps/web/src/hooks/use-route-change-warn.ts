import { useEffect } from 'react'

export function useRouteChangeWarning(shouldWarn: boolean) {
  useEffect(() => {
    if (!shouldWarn) return

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      window.confirm('Are you sure you want to leave this page?')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [shouldWarn])
}
