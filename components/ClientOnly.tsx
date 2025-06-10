'use client'

import { useHasMounted } from '../utils/hooks'

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const hasMounted = useHasMounted()
  if (!hasMounted) return null
  return <>{children}</>
}

export default ClientOnly
