'use client'

import { ReactNode } from 'react'
import { NotificationContainer } from '@/components/ui/notification'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <NotificationContainer />
    </>
  )
}
