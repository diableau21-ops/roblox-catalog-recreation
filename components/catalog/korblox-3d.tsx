'use client'

type Props = { rotating?: boolean; tryOn?: boolean }

const SKETCHFAB_MODEL_ID = '2371f80005c14807b5627b148739e04b'

export function Korblox3D(_props: Props) {
  return (
    <div className="absolute inset-0 bg-[#17181c]">
      <iframe
        title="Korblox 3D model on Sketchfab"
        className="absolute inset-0 h-full w-full border-0"
        src={`https://sketchfab.com/models/${SKETCHFAB_MODEL_ID}/embed?autostart=1&preload=1&ui_hint=2`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
