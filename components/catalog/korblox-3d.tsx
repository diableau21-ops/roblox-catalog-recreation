'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

type Props = { rotating: boolean; tryOn: boolean }

export function Korblox3D({ rotating, tryOn }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState('Chargement du modèle officiel Roblox…')
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const rotatingRef = useRef(rotating)
  const tryOnRef = useRef(tryOn)
  useEffect(() => { rotatingRef.current = rotating }, [rotating])
  useEffect(() => { tryOnRef.current = tryOn }, [tryOn])

  useEffect(() => {
    const element = host.current
    if (!element) return
    let stopped = false
    let frame = 0
    let model: THREE.Group | null = null
    let dragging = false
    let lastX = 0
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#17181c')
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
    camera.position.set(0, 1.7, 7)
    camera.lookAt(0, 1.7, 0)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(element.clientWidth, element.clientHeight)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none'
    element.appendChild(renderer.domElement)
    scene.add(new THREE.HemisphereLight(0xffffff, 0x202030, 2))
    const light = new THREE.DirectionalLight(0xffffff, 3)
    light.position.set(4, 7, 5)
    scene.add(light)
    const resize = () => {
      if (stopped) return
      camera.aspect = Math.max(element.clientWidth, 1) / Math.max(element.clientHeight, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(element.clientWidth, element.clientHeight)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(element)
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; renderer.domElement.setPointerCapture(e.pointerId) }
    const move = (e: PointerEvent) => { if (dragging && model) { model.rotation.y += (e.clientX - lastX) * .012; lastX = e.clientX } }
    const up = () => { dragging = false }
    renderer.domElement.addEventListener('pointerdown', down)
    renderer.domElement.addEventListener('pointermove', move)
    renderer.domElement.addEventListener('pointerup', up)
    renderer.domElement.addEventListener('pointercancel', up)

    const load = async () => {
      try {
        const res = await fetch('/api/korblox-preview')
        const info = await res.json()
        if (!res.ok) {
          if (typeof info.thumbnailUrl === 'string') setThumbnailUrl(info.thumbnailUrl)
          throw new Error(info.error || 'Aperçu 3D indisponible.')
        }
        const objLoader = new OBJLoader()
        if (info.mtl) {
          const mats = await new Promise<THREE.MaterialCreator>((resolve, reject) => new MTLLoader().load(info.mtl, resolve, undefined, reject))
          if (stopped) return
          mats.preload()
          objLoader.setMaterials(mats)
        }
        const obj = await new Promise<THREE.Group>((resolve, reject) => objLoader.load(info.obj, resolve, undefined, reject))
        if (stopped) return
        const bounds = new THREE.Box3().setFromObject(obj)
        const size = bounds.getSize(new THREE.Vector3())
        const center = bounds.getCenter(new THREE.Vector3())
        const scale = 3.4 / Math.max(size.x, size.y, size.z, 0.01)
        obj.scale.setScalar(scale)
        obj.position.set(-center.x * scale, -bounds.min.y * scale, -center.z * scale)
        model = new THREE.Group()
        model.add(obj)
        scene.add(model)
        setMessage('')
      } catch (error) {
        if (!stopped) setMessage(error instanceof Error ? error.message : 'Impossible de charger le modèle officiel.')
      }
    }
    void load()
    let previous = 0
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      const delta = Math.min((time - previous) / 1000, .05)
      previous = time
      if (model) {
        if (rotatingRef.current && !dragging) model.rotation.y += delta * .8
        model.scale.setScalar(tryOnRef.current ? 1.08 : 1)
      }
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      renderer.domElement.removeEventListener('pointerdown', down)
      renderer.domElement.removeEventListener('pointermove', move)
      renderer.domElement.removeEventListener('pointerup', up)
      renderer.domElement.removeEventListener('pointercancel', up)
      scene.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          part.geometry.dispose()
          const mats = Array.isArray(part.material) ? part.material : [part.material]
          mats.forEach((mat) => mat.dispose())
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label="Aperçu 3D officiel Roblox" role="img">
    {thumbnailUrl && <img src={thumbnailUrl} alt="Korblox Deathspeaker — image officielle Roblox" className="absolute inset-0 z-[5] h-full w-full object-contain" />}
    {message && <div className="absolute inset-x-3 bottom-3 z-10 rounded-lg bg-black/80 px-3 py-2 text-center text-xs text-white">{thumbnailUrl ? 'Image officielle Roblox — aperçu 3D indisponible' : message}</div>}
  </div>
}
