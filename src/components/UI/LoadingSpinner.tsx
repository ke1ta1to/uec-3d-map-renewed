'use client'

import { useState, useEffect, useImperativeHandle, forwardRef } from 'react'

interface LoadingSpinnerProps {
  onComplete?: () => void
}

interface LoadingSpinnerRef {
  completeLoading: () => void
}

const LoadingSpinner = forwardRef<LoadingSpinnerRef, LoadingSpinnerProps>(({ onComplete }, ref) => {
  const [dots, setDots] = useState('.')
  const [progress, setProgress] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isCompleting) return
    
    // プログレスバーを徐々に進行（もう少し遅く）
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) return prev // 85%で停止
        // より遅い進行速度
        const increment = prev < 20 ? 1.5 : prev < 50 ? 1 : prev < 75 ? 0.7 : 0.3
        return Math.min(prev + increment, 85)
      })
    }, 150) // 150msごとに更新
    
    return () => clearInterval(progressInterval)
  }, [isCompleting])

  // 外部から呼び出される完了処理
  useImperativeHandle(ref, () => ({
    completeLoading: () => {
      if (isCompleting) return
      
      setIsCompleting(true)
      
      // 0.2秒待ってから100%まで進行
      setTimeout(() => {
        setProgress(100)
        // さらに0.3秒後にフェードアウト開始
        setTimeout(() => {
          setOpacity(0)
          // フェードアウト完了後に非表示
          setTimeout(() => {
            onComplete?.()
          }, 600) // フェードアウトアニメーション時間
        }, 300)
      }, 200)
    }
  }))


  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-800 to-gray-900 z-[60] transition-opacity duration-600 ease-out"
      style={{ opacity }}
    >
      <div className="flex flex-col items-center gap-6 p-8">
        {/* メインローディングアニメーション */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{animationDuration: '1s'}}></div>
          </div>
          <div className="absolute inset-0 w-16 h-16 border-2 border-cyan-400/40 rounded-full animate-pulse"></div>
        </div>
        
        {/* テキストセクション */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-white">3D マップを準備中</h2>
          <p className="text-blue-200 font-medium">
            UEC キャンパスモデルを読み込み中{dots}
          </p>
          <div className="text-sm text-gray-300 mt-4 space-y-1">
            <p>📁 ファイルサイズ: 約12MB</p>
            <p>🏗️ 3Dモデル形式: GLB</p>
            <p>⚡ 進行状況: {Math.round(progress)}%</p>
          </div>
        </div>
        
        {/* プログレスバー */}
        <div className="w-64 h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-xs text-gray-400 text-center max-w-md">
          モデルの読み込みが完了すると、WASD + マウスで探索できます
        </p>
      </div>
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

export default LoadingSpinner