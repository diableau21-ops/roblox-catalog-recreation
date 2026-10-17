'use client'

type Props = { rotating?: boolean; tryOn?: boolean }

const SKETCHFAB_MODEL_ID = '2371f80005c14807b5627b148739e04b'

export function Korblox3D(_props: Props) {
  return (
    <div className="absolute inset-0 bg-[#f2f4f5]">
      <iframe
        title="Korblox interactive 3D model"
        className="absolute inset-0 h-full w-full border-0"
        src={`https://sketchfab.com/models/${SKETCHFAB_MODEL_ID}/embed?autostart=1&autospin=0.5&preload=1&transparent=1&ui_theme=light&ui_hint=2&ui_controls=1&ui_animations=0`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  )
}
