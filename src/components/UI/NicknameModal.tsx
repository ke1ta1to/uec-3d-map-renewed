'use client'

import { useState } from 'react'
import Card from '@/components/common/Card'

interface NicknameModalProps {
  isOpen: boolean
  initialNickname: string
  onConfirm: (nickname: string) => void
}

/**
 * 開始時のニックネーム設定モーダル
 */
export function NicknameModal({ isOpen, initialNickname, onConfirm }: NicknameModalProps) {
  const [nickname, setNickname] = useState(initialNickname)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedNickname = nickname.trim()
    if (trimmedNickname) {
      onConfirm(trimmedNickname)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70]">
      <Card variant="dark" className="max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            3Dキャンパスマップへようこそ
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="nickname" className="block text-white text-sm font-medium mb-2">
                ニックネームを入力してください
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                placeholder="あなたの名前"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                autoFocus
              />
              <p className="text-gray-400 text-xs mt-1">
                最大20文字まで（他のプレイヤーに表示されます）
              </p>
            </div>

            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="text-white font-medium mb-2">操作方法</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">WASD</kbd> - 移動</li>
                <li>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">Space</kbd> - ジャンプ</li>
                <li>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">マウス</kbd> - 視点操作</li>
                <li>• <kbd className="px-1 py-0.5 bg-gray-700 rounded text-xs">ESC</kbd> - 一時停止</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={!nickname.trim()}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              マップを開始
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}