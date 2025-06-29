'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import Model from './Model'
import LoadingSpinner from '../UI/LoadingSpinner'

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <Canvas
          camera={{
            position: [50, 50, 50],
            fov: 60,
          }}
          className="bg-gray-100"
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {/* ライティング */}
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[100, 100, 50]} 
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <hemisphereLight intensity={0.35} />
            
            {/* GLBモデル */}
            <Model />
            
            {/* カメラコントロール（レスポンシブ性改善） */}
            <OrbitControls 
              enablePan 
              enableZoom 
              enableRotate
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={0.5}
              zoomSpeed={0.8}
              panSpeed={0.8}
              minDistance={10}
              maxDistance={200}
            />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  )
}