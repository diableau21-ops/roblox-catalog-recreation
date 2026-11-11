'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CatalogApp } from '@/components/catalog/catalog-app'

export default function Page() {
  const router = useRouter()
  const [authenticatedDemo, setAuthenticatedDemo] = useState(false)

  useEffect(() => {
    const profile = window.localStorage.getItem('catalog-demo-profile')
    if (profile) setAuthenticatedDemo(true)
    else router.replace('/login')
  }, [router])

  if (!authenticatedDemo) return null
  return <CatalogApp />
}
