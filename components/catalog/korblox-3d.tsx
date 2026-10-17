'use client'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

type Props = { rotating: boolean; tryOn: boolean }

export function Korblox3D({ rotating, tryOn }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState('Création du modèle 3D…')
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
    camera.position.set(0, 1.8, 7.5)
    camera.lookAt(0, 1.75, 0)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(element.clientWidth, element.clientHeight)
    renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;touch-action:none'
    element.appendChild(renderer.domElement)
    scene.add(new THREE.HemisphereLight(0xdbe8ff, 0x17111f, 2.2))
    const light = new THREE.DirectionalLight(0xffffff, 3.2)
    light.position.set(4, 7, 5)
    scene.add(light)
    const rim = new THREE.PointLight(0x258bff, 3, 10)
    rim.position.set(-3, 2.7, -2)
    scene.add(rim)

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

    const makeModel = () => {
      const root = new THREE.Group()
      const dark = new THREE.MeshStandardMaterial({ color: 0x171a22, roughness: 0.7, metalness: 0.45 })
      const armor = new THREE.MeshStandardMaterial({ color: 0x303744, roughness: 0.42, metalness: 0.65 })
      const edge = new THREE.MeshStandardMaterial({ color: 0x657080, roughness: 0.35, metalness: 0.7 })
      const blue = new THREE.MeshStandardMaterial({ color: 0x167bff, emissive: 0x075bff, emissiveIntensity: 1.15, roughness: 0.35, metalness: 0.2 })
      const bone = new THREE.MeshStandardMaterial({ color: 0xb9d9f4, emissive: 0x164b8b, emissiveIntensity: 0.35, roughness: 0.5 })
      const black = new THREE.MeshStandardMaterial({ color: 0x080a0f, roughness: 0.85 })
      const add = (geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, parent: THREE.Group = root) => {
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(x, y, z)
        mesh.scale.set(sx, sy, sz)
        mesh.castShadow = true
        mesh.receiveShadow = true
        parent.add(mesh)
        return mesh
      }
      const box = (x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: THREE.Material, parent: THREE.Group = root) =>
        add(new THREE.BoxGeometry(1, 1, 1), mat, x, y, z, sx, sy, sz, parent)
      const sphere = (x: number, y: number, z: number, sx: number, sy: number, sz: number, mat: THREE.Material, parent: THREE.Group = root) =>
        add(new THREE.SphereGeometry(0.5, 16, 12), mat, x, y, z, sx, sy, sz, parent)
      const limb = (a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material, parent: THREE.Group = root) => {
        const direction = new THREE.Vector3().subVectors(b, a)
        const mesh = add(new THREE.CylinderGeometry(radius * 0.78, radius, direction.length(), 8), mat, (a.x+b.x)/2, (a.y+b.y)/2, (a.z+b.z)/2, 1, 1, 1, parent)
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
        return mesh
      }

      // Robe and angular chest armor
      box(0, 1.92, 0, 0.72, 0.86, 0.38, dark)
      box(0, 2.12, 0.205, 0.64, 0.42, 0.12, armor)
      box(0, 1.79, 0.22, 0.58, 0.1, 0.09, edge)
      box(0, 1.39, 0, 0.82, 0.42, 0.43, black)
      box(0, 1.15, 0, 0.94, 0.12, 0.48, dark)
      // Shoulder plates and arms
      sphere(-0.49, 2.22, 0, 0.35, 0.28, 0.35, armor)
      sphere(0.49, 2.22, 0, 0.35, 0.28, 0.35, armor)
      box(-0.5, 2.19, 0.18, 0.24, 0.08, 0.12, edge)
      box(0.5, 2.19, 0.18, 0.24, 0.08, 0.12, edge)
      limb(new THREE.Vector3(-0.56, 2.08, 0), new THREE.Vector3(-0.69, 1.52, 0.02), 0.13, dark)
      limb(new THREE.Vector3(0.56, 2.08, 0), new THREE.Vector3(0.68, 1.54, 0.02), 0.13, dark)
      sphere(-0.69, 1.49, 0.03, 0.17, 0.18, 0.17, armor)
      sphere(0.68, 1.5, 0.03, 0.17, 0.18, 0.17, armor)
      // Hood, glowing blue skull and face
      const hood = new THREE.Group()
      hood.position.set(0, 2.77, 0)
      root.add(hood)
      sphere(0, 0, -0.02, 0.62, 0.7, 0.58, black, hood)
      sphere(0, -0.02, 0.16, 0.39, 0.43, 0.36, blue, hood)
      sphere(-0.13, 0.035, 0.455, 0.09, 0.07, 0.045, black, hood)
      sphere(0.13, 0.035, 0.455, 0.09, 0.07, 0.045, black, hood)
      box(0, -0.17, 0.48, 0.2, 0.045, 0.04, bone, hood)
      // Pointed crown / horns
      const hornL = add(new THREE.ConeGeometry(0.13, 0.48, 8), armor, -0.31, 0.39, 0, 1, 1, 1, hood)
      hornL.rotation.z = 0.34
      const hornR = add(new THREE.ConeGeometry(0.13, 0.48, 8), armor, 0.31, 0.39, 0, 1, 1, 1, hood)
      hornR.rotation.z = -0.34
      box(0, 0.3, 0, 0.62, 0.12, 0.58, dark, hood)
      // Belt buckle and glowing rune
      box(0, 1.43, 0.25, 0.19, 0.18, 0.08, edge)
      sphere(0, 1.43, 0.3, 0.07, 0.07, 0.035, blue)
      // One armored leg and one spectral blue leg, inspired by the bundle silhouette
      box(-0.22, 0.86, 0, 0.27, 0.55, 0.28, dark)
      box(-0.22, 0.63, 0.03, 0.31, 0.12, 0.33, armor)
      box(-0.22, 0.28, 0.02, 0.32, 0.44, 0.32, armor)
      box(-0.22, 0.07, 0.12, 0.43, 0.13, 0.55, black)
      box(-0.22, 0.86, 0.16, 0.08, 0.3, 0.035, edge)
      limb(new THREE.Vector3(0.22, 1.08, 0), new THREE.Vector3(0.24, 0.53, 0.02), 0.105, blue)
      limb(new THREE.Vector3(0.24, 0.53, 0.02), new THREE.Vector3(0.24, 0.2, 0.04), 0.09, bone)
      sphere(0.24, 0.53, 0.02, 0.14, 0.12, 0.14, blue)
      box(0.24, 0.1, 0.13, 0.3, 0.1, 0.42, dark)
      // Small armor spikes
      const spikeL = add(new THREE.ConeGeometry(0.09, 0.22, 6), edge, -0.65, 2.32, 0)
      spikeL.rotation.z = Math.PI / 2
      const spikeR = add(new THREE.ConeGeometry(0.09, 0.22, 6), edge, 0.65, 2.32, 0)
      spikeR.rotation.z = -Math.PI / 2
      root.position.y = 0
      return root
    }

    const load = async () => {
      let officialBundleLoaded = false
      try {
        const bundleResponse = await fetch('/api/korblox-bundle')
        if (bundleResponse.ok) {
          const bundle = await bundleResponse.json()
          officialBundleLoaded = bundle?.id === 192 && Array.isArray(bundle?.items)
        }
      } catch {
        // The 3D viewer can still work if catalog metadata is temporarily unavailable.
      }
      try {
        const res = await fetch('/api/korblox-preview')
        const info = await res.json()
        if (!res.ok) throw new Error(info.error || 'Aperçu officiel 3D indisponible.')
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
      } catch {
        if (stopped) return
        model = makeModel()
        scene.add(model)
        setMessage(officialBundleLoaded
          ? 'Données officielles Korblox chargées · modèle 3D recréé — fais glisser pour tourner'
          : 'Modèle 3D recréé — fais glisser pour le tourner')
      }
    }
    void load()
    let previous = 0
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      const delta = Math.min((time - previous) / 1000, 0.05)
      previous = time
      if (model) {
        if (rotatingRef.current && !dragging) model.rotation.y += delta * 0.8
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

  return <div ref={host} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label="Aperçu 3D Korblox Deathspeaker, modèle recréé avec données du catalogue officiel" role="img">
    {message && <div className="absolute inset-x-3 bottom-3 z-10 rounded-lg bg-black/80 px-3 py-2 text-center text-xs text-white">{message}</div>}
  </div>
}
