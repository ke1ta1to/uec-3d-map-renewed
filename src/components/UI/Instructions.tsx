'use client'

import { useState } from 'react'
import Card from '../common/Card'

interface InstructionsProps {
  walkSpeed: number
  jumpHeight: number
  onWalkSpeedChange: (speed: number) => void
  onJumpHeightChange: (height: number) => void
  showDebug: boolean
  onDebugToggle: (show: boolean) => void
}

export default function Instructions({ 
  walkSpeed, 
  jumpHeight, 
  onWalkSpeedChange, 
  onJumpHeightChange,
  showDebug,
  onDebugToggle
}: InstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="fixed top-4 left-4 z-50 space-y-4 max-w-sm">
      {/* 操作説明 */}
      <Card title="操作方法">
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs w-[70px] text-center">W A S D</span>
            <span className="text-gray-300 ml-3">移動</span>
          </div>
          <div className="flex items-center">
            <span className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs w-[70px] text-center">Space</span>
            <span className="text-gray-300 ml-3">ジャンプ</span>
          </div>
          <div className="flex items-center">
            <span className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs w-[70px] text-center">マウス</span>
            <span className="text-gray-300 ml-3">視点操作</span>
          </div>
          <div className="flex items-center">
            <span className="font-mono bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs w-[70px] text-center">ESC</span>
            <span className="text-gray-300 ml-3">一時停止</span>
          </div>
          <p className="text-xs text-blue-200 mt-3 pt-2 border-t border-gray-600">
            画面をクリックしてマウスロック開始
          </p>
        </div>
      </Card>

      {/* 設定パネル */}
      <Card variant="darker">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between font-bold hover:bg-white/10 p-2 rounded transition-colors"
        >
          <span>設定</span>
          <span className="text-blue-400">{isExpanded ? '▼' : '▶'}</span>
        </button>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-600 space-y-4">
            {/* 歩行速度 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">
                歩行速度: <span className="text-white">{walkSpeed.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="2"
                max="20"
                step="0.5"
                value={walkSpeed}
                onChange={(e) => onWalkSpeedChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* ジャンプの高さ */}
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">
                ジャンプの高さ: <span className="text-white">{jumpHeight.toFixed(1)}</span>
              </label>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={jumpHeight}
                onChange={(e) => onJumpHeightChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* デバッグ表示トグル */}
            <div className="pt-2 border-t border-gray-600">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDebug}
                  onChange={(e) => onDebugToggle(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-300">デバッグ情報を表示</span>
              </label>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}