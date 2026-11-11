import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 192, height: 192 }

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#00A2FF', borderRadius: 42 }}>
      <div style={{ width: 96, height: 96, transform: 'rotate(15deg)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 27, height: 27, background: '#00A2FF' }} />
      </div>
    </div>,
    { ...size }
  )
}
