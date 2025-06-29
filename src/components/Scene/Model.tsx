'use client'

import { useGLTF } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { Group } from 'three'

export default function Model() {
  const groupRef = useRef<Group>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
    useGLTF.preload('/uec-all.glb')
  }, [])
  
  // クライアントサイドでのみGLTFを読み込み
  if (!isClient) {
    return null
  }
  
  const { scene } = useGLTF('/uec-all.glb')
  
  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}