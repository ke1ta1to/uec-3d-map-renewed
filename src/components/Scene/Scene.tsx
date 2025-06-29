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
            position: [100, 80, 100],
            fov: 45,
          }}
          className="bg-gradient-to-b from-blue-50 to-gray-100"
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {/* ライティング */}
            <ambientLight intensity={1.2} />
            <directionalLight 
              position={[50, 100, 50]} 
              intensity={1.5}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <directionalLight 
              position={[-50, 100, -50]} 
              intensity={0.8}
            />
            <hemisphereLight 
              intensity={0.8}
              color="#ffffff"
              groundColor="#cccccc"
            />
            
            {/* GLBモデル */}
            <Model />
            
            {/* カメラコントロール（レスポンシブ性改善） */}
            <OrbitControls 
              enablePan 
              enableZoom 
              enableRotate
              enableDamping
              dampingFactor={0.03}
              rotateSpeed={0.6}
              zoomSpeed={1.0}
              panSpeed={1.0}
              minDistance={20}
              maxDistance={300}
              target={[0, 0, 0]}
            />
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  )
}