'use client'

import { useState, useEffect } from 'react'

interface DebugInfoProps {
  isVisible: boolean
  debugData?: {
    position: { x: number, y: number, z: number }
    rotation: { x: number, y: number, z: number }
  }
}

export default function DebugInfo({ isVisible, debugData }: DebugInfoProps) {
  const [fps, setFps] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let frameCount = 0
    let lastTime = Date.now()

    const updateFps = () => {
      frameCount++
      const now = Date.now()
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)))
        frameCount = 0
        lastTime = now
      }
      if (isVisible) {
        requestAnimationFrame(updateFps)
      }
    }

    const animationId = requestAnimationFrame(updateFps)
    return () => cancelAnimationFrame(animationId)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-50 border border-gray-600">
      <h3 className="font-bold mb-2 text-center">デバッグ情報</h3>
      <div className="space-y-1">
        <div>
          <span className="text-gray-400">FPS:</span> {fps}
        </div>
        {debugData && (
          <>
            <div>
              <span className="text-gray-400">位置:</span>
            </div>
            <div className="ml-2">
              <div>X: {debugData.position.x}</div>
              <div>Y: {debugData.position.y}</div>
              <div>Z: {debugData.position.z}</div>
            </div>
            <div>
              <span className="text-gray-400">回転 (度):</span>
            </div>
            <div className="ml-2">
              <div>X: {debugData.rotation.x}°</div>
              <div>Y: {debugData.rotation.y}°</div>
              <div>Z: {debugData.rotation.z}°</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}