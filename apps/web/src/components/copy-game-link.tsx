'use client'

import { toast } from '@/components/ui/8bit/toast'
import { Button } from '@/components/ui/8bit/button'
import { usePathname } from 'next/navigation'
import { env } from '@/env'

export function CopyGameLink() {
  const pathname = usePathname()

  const handleCopyLink = async () => {
    try {
      const URL = `${env.NEXT_PUBLIC_PROD_URL}${pathname}`
      await navigator.clipboard.writeText(URL)
      toast('Link copied!')
    } catch {
      toast('An ocurred to copy link')
    }
  }

  return <Button onClick={handleCopyLink}>Copy link</Button>
}
