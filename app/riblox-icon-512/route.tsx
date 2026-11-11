import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 512, height: 512 }

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00A2FF', borderRadius: 112 }}>
      <div style={{ width: 260, height: 260, transform: 'rotate(15deg)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 72, height: 72, background: '#00A2FF' }} />
      </div>
    </div>,
    { ...size }
  )
}
