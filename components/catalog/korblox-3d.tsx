'use client'

import { useEffect, useRef } from 'react'

type ViewerApi = {
  start: () => void
  setBackground: (options: { color: [number, number, number] }, callback?: () => void) => void
}

type SketchfabClient = {
  init: (
    modelId: string,
    options: {
      autostart: 1
      autospin: number
      ui_theme: 'dark'
      transparent: 0
      success: (api: ViewerApi) => void
      error: () => void
    }
  ) => void
}

declare global {
  interface Window {
    Sketchfab?: new (iframe: HTMLIFrameElement) => SketchfabClient
  }
}

const SKETCHFAB_MODEL_ID = '2371f80005c14807b5627b148739e04b'
const VIEWER_API_URL = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js'
const BACKGROUND = 35 / 255

export function Korblox3D(_props: { rotating?: boolean; tryOn?: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    let cancelled = false
    const iframe = iframeRef.current
    if (!iframe) return

    const initialize = () => {
      if (cancelled || !iframeRef.current || !window.Sketchfab) return
      const client = new window.Sketchfab(iframeRef.current)
      client.init(SKETCHFAB_MODEL_ID, {
        autostart: 1,
        autospin: 0.5,
        ui_theme: 'dark',
        transparent: 0,
        success: (api) => {
          if (cancelled) return
          api.start()
          api.setBackground({ color: [BACKGROUND, BACKGROUND, BACKGROUND] })
        },
        error: () => {},
      })
    }

    if (window.Sketchfab) {
      initialize()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${VIEWER_API_URL}"]`)
      if (existing) existing.addEventListener('load', initialize, { once: true })
      else {
        const script = document.createElement('script')
        script.src = VIEWER_API_URL
        script.async = true
        script.onload = initialize
        document.head.appendChild(script)
      }
    }

    return () => { cancelled = true }
  }, [])

  return (
    <div className="absolute inset-0 bg-[#232323]">
      <iframe
        ref={iframeRef}
        title="Korblox interactive 3D model"
        className="absolute inset-0 h-full w-full border-0"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
