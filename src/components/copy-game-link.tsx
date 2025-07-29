'use client'

import { toast } from '@/components/ui/8bit/toast'
import { Button } from '@/components/ui/8bit/button'
import { usePathname } from 'next/navigation'

export function CopyGameLink() {
  const pathname = usePathname()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pathname)
      toast('Link copied!')
    } catch {
      toast('An ocurred to copy link')
    }
  }

  return <Button onClick={handleCopyLink}>Copy link</Button>
}
