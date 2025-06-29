'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: [10, 10, 10],
          fov: 50,
        }}
        className="bg-gray-100"
      >
        <Suspense fallback={null}>
          {/* ライティング */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {/* テスト用のボックス */}
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          
          {/* カメラコントロール */}
          <OrbitControls enablePan enableZoom enableRotate />
        </Suspense>
      </Canvas>
    </div>
  )
}