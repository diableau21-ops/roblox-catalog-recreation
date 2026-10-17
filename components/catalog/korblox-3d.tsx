'use client'

type Props = { rotating?: boolean; tryOn?: boolean }

const SKETCHFAB_MODEL_ID = '87163e4880a24128b88f86726a968691'

export function Korblox3D(_props: Props) {
  return (
    <div className="absolute inset-0 bg-[#17181c]">
      <iframe
        title="Korblox Deathspeaker 3D model by masterroblox384 on Sketchfab"
        className="absolute inset-0 h-full w-full border-0"
        src={`https://sketchfab.com/models/${SKETCHFAB_MODEL_ID}/embed?autostart=1&preload=1&ui_hint=2`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] text-white/80">
        Modèle Sketchfab par masterroblox384 · CC Attribution
      </div>
    </div>
  )
}
