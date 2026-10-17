'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Props = { rotating: boolean; tryOn: boolean }

export function Korblox3D({ rotating, tryOn }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const rotatingRef = useRef(rotating)
  useEffect(() => { rotatingRef.current = rotating }, [rotating])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#17181c')
    scene.fog = new THREE.Fog('#17181c', 10, 22)

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 2.15, 8.5)
    camera.lookAt(0, 1.75, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.touchAction = 'none'
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xb9d5ff, 0x17121e, 2.1))
    const key = new THREE.DirectionalLight(0xffffff, 3.2)
    key.position.set(4, 7, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x367dff, 2.5)
    rim.position.set(-4, 3, -4)
    scene.add(rim)
    const fill = new THREE.PointLight(0x5e9dff, 14, 10)
    fill.position.set(0, 2.2, 3)
    scene.add(fill)

    const character = new THREE.Group()
    scene.add(character)

    const material = (color: string, metalness = 0.15, roughness = 0.52) =>
      new THREE.MeshStandardMaterial({ color, metalness, roughness })
    const blue = material('#174cbb', 0.38, 0.34)
    const blueLight = material('#3479ed', 0.45, 0.3)
    const darkBlue = material('#101a36', 0.35, 0.38)
    const black = material('#090b12', 0.25, 0.4)
    const silver = material('#b9c8d9', 0.62, 0.3)
    const bone = material('#e1e6ed', 0.12, 0.55)
    const gold = material('#a77a35', 0.72, 0.3)
    const eye = new THREE.MeshStandardMaterial({ color: '#48c9ff', emissive: '#168aff', emissiveIntensity: 3 })

    const addBox = (parent: THREE.Object3D, size: [number, number, number], pos: [number, number, number], mat: THREE.Material, bevel = false) => {
      const geometry = new THREE.BoxGeometry(...size)
      const mesh = new THREE.Mesh(geometry, mat)
      mesh.position.set(...pos)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      if (bevel) {
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: '#8cb9ff', transparent: true, opacity: 0.18 }))
        edge.position.copy(mesh.position)
        parent.add(edge)
      }
      return mesh
    }
    const addSphere = (parent: THREE.Object3D, radius: number, pos: [number, number, number], mat: THREE.Material, scale: [number, number, number] = [1, 1, 1]) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 16), mat)
      mesh.position.set(...pos)
      mesh.scale.set(...scale)
      mesh.castShadow = true
      parent.add(mesh)
      return mesh
    }
    const addCylinder = (parent: THREE.Object3D, rt: number, rb: number, h: number, pos: [number, number, number], mat: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 12), mat)
      mesh.position.set(...pos)
      mesh.castShadow = true
      parent.add(mesh)
      return mesh
    }

    // Blocky fantasy avatar silhouette
    addBox(character, [0.92, 1.2, 0.48], [0, 2.15, 0], blue, true)
    addBox(character, [1.08, 0.22, 0.56], [0, 2.72, 0], silver)
    addBox(character, [0.82, 0.28, 0.5], [0, 1.55, 0], darkBlue)
    addBox(character, [1.1, 0.45, 0.64], [0, 1.27, 0], blue)
    addBox(character, [0.18, 0.78, 0.16], [0, 2.12, 0.27], gold)
    addSphere(character, 0.075, [0, 2.22, 0.37], eye)

    // Shoulder armor and arms
    addBox(character, [0.46, 0.42, 0.48], [-0.7, 2.62, 0], darkBlue, true)
    addBox(character, [0.28, 0.25, 0.3], [-0.7, 2.68, 0.12], silver)
    addBox(character, [0.46, 0.42, 0.48], [0.7, 2.62, 0], darkBlue, true)
    addBox(character, [0.28, 0.25, 0.3], [0.7, 2.68, 0.12], silver)
    addBox(character, [0.3, 0.83, 0.32], [-0.73, 2.03, 0], blue)
    addBox(character, [0.3, 0.83, 0.32], [0.73, 2.03, 0], blue)
    addBox(character, [0.34, 0.18, 0.36], [-0.73, 1.57, 0], silver)
    addBox(character, [0.34, 0.18, 0.36], [0.73, 1.57, 0], silver)

    // Hood, helmet and glowing skull-like face
    addBox(character, [0.9, 0.78, 0.78], [0, 3.25, -0.03], black, true)
    addBox(character, [0.7, 0.13, 0.72], [0, 3.68, -0.03], darkBlue)
    addBox(character, [0.62, 0.48, 0.12], [0, 3.22, 0.39], bone)
    addBox(character, [0.19, 0.12, 0.045], [-0.16, 3.29, 0.465], eye)
    addBox(character, [0.19, 0.12, 0.045], [0.16, 3.29, 0.465], eye)
    addBox(character, [0.12, 0.15, 0.06], [0, 3.12, 0.47], darkBlue)
    addBox(character, [0.7, 0.12, 0.12], [0, 2.91, 0.4], silver)

    // One armored leg and one skeletal leg for the Korblox-inspired look
    addBox(character, [0.42, 0.62, 0.45], [0.29, 0.86, 0], blueLight, true)
    addBox(character, [0.46, 0.18, 0.5], [0.29, 0.52, 0.03], darkBlue)
    addBox(character, [0.48, 0.2, 0.62], [0.29, 0.32, 0.09], black)
    addBox(character, [0.28, 0.16, 0.3], [-0.28, 1.04, 0], darkBlue)
    addCylinder(character, 0.095, 0.12, 0.65, [-0.28, 0.65, 0], bone)
    addSphere(character, 0.13, [-0.28, 0.98, 0], silver, [1, 0.8, 1])
    addSphere(character, 0.12, [-0.28, 0.32, 0], silver, [1, 0.8, 1])
    addCylinder(character, 0.06, 0.07, 0.18, [-0.28, 0.19, 0], bone)
    addBox(character, [0.34, 0.12, 0.44], [-0.28, 0.09, 0.08], darkBlue)

    // Small floor disc gives the model a grounded studio preview
    const floor = new THREE.Mesh(new THREE.CircleGeometry(1.45, 48), material('#252a35', 0.25, 0.65))
    floor.rotation.x = -Math.PI / 2
    floor.position.y = 0.015
    floor.scale.set(1, 0.8, 1)
    scene.add(floor)
    const grid = new THREE.GridHelper(8, 16, 0x39465e, 0x252c39)
    grid.position.y = 0.02
    const gridMat = grid.material as THREE.Material
    gridMat.transparent = true
    gridMat.opacity = 0.24
    scene.add(grid)

    const resize = () => {
      const w = Math.max(host.clientWidth, 1)
      const h = Math.max(host.clientHeight, 1)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(host)

    let dragging = false
    let previousX = 0
    const down = (e: PointerEvent) => { dragging = true; previousX = e.clientX; renderer.domElement.setPointerCapture(e.pointerId) }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      character.rotation.y += (e.clientX - previousX) * 0.012
      previousX = e.clientX
    }
    const up = () => { dragging = false }
    renderer.domElement.addEventListener('pointerdown', down)
    renderer.domElement.addEventListener('pointermove', move)
    renderer.domElement.addEventListener('pointerup', up)
    renderer.domElement.addEventListener('pointercancel', up)

    let frame = 0
    let previousTime = 0
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate)
      const delta = Math.min((time - previousTime) / 1000, 0.05)
      previousTime = time
      if (rotatingRef.current && !dragging) character.rotation.y += delta * 1.15
      character.scale.setScalar(tryOn ? 1.12 : 1)
      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      renderer.domElement.removeEventListener('pointerdown', down)
      renderer.domElement.removeEventListener('pointermove', move)
      renderer.domElement.removeEventListener('pointerup', up)
      renderer.domElement.removeEventListener('pointercancel', up)
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments) {
          obj.geometry.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((mat) => mat.dispose())
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [tryOn])

  return <div ref={hostRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label="Aperçu 3D du personnage Korblox" role="img" />
}
