'use client'

import Script from 'next/script'
import { useGoogleOneTap } from '@/lib/hooks/use-google-one-tap'

export default function GoogleOneTap() {
  const { onScriptLoad, onScriptError } = useGoogleOneTap()
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!googleClientId) return null

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={onScriptLoad}
      onError={onScriptError}
    />
  )
}
