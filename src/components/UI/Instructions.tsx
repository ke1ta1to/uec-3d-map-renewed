'use client'

import { useState } from 'react'

interface InstructionsProps {
  walkSpeed: number
  jumpHeight: number
  onWalkSpeedChange: (speed: number) => void
  onJumpHeightChange: (height: number) => void
}

export default function Instructions({ 
  walkSpeed, 
  jumpHeight, 
  onWalkSpeedChange, 
  onJumpHeightChange 
}: InstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* 操作説明 */}
      <div className="bg-black/70 text-white p-4 rounded-lg mb-4 max-w-sm">
        <h3 className="text-lg font-bold mb-2">操作方法</h3>
        <div className="space-y-1 text-sm">
          <p><span className="font-mono bg-gray-700 px-1 rounded">W A S D</span> : 移動</p>
          <p><span className="font-mono bg-gray-700 px-1 rounded">Space</span> : ジャンプ</p>
          <p><span className="font-mono bg-gray-700 px-1 rounded">マウス</span> : 視点操作</p>
          <p className="text-xs text-gray-300 mt-2">
            画面をクリックしてマウスロック開始
          </p>
        </div>
      </div>

      {/* 設定パネル */}
      <div className="bg-black/70 text-white rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 text-left font-bold hover:bg-white/10 rounded-lg"
        >
          設定 {isExpanded ? '▼' : '▶'}
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-600 space-y-3">
            {/* 歩行速度 */}
            <div>
              <label className="block text-sm font-medium mb-1">
                歩行速度: {walkSpeed.toFixed(1)}
              </label>
              <input
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={walkSpeed}
                onChange={(e) => onWalkSpeedChange(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* ジャンプの高さ */}
            <div>
              <label className="block text-sm font-medium mb-1">
                ジャンプの高さ: {jumpHeight.toFixed(1)}
              </label>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={jumpHeight}
                onChange={(e) => onJumpHeightChange(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}