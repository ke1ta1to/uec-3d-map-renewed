'use client'

import { useRef, Suspense } from 'react'
import { Group } from 'three'
import type { Database } from '@/types/supabase'
import { PlayerModel } from './PlayerModel'
import { PlayerNickname } from './PlayerNickname'
import { PlayerFallback } from './PlayerFallback'
import { usePlayerMovement } from '@/hooks/usePlayerMovement'

type PlayerPosition = Database['public']['Tables']['player_positions']['Row']

interface OtherPlayerProps {
  player: PlayerPosition
}

/**
 * 他プレイヤーの3D表示コンポーネント
 * スムーズな移動補間と進行方向に基づく回転を行う
 */
export default function OtherPlayer({ player }: OtherPlayerProps) {
  const groupRef = useRef<Group>(null)
  
  // プレイヤーの移動とローテーションを管理
  usePlayerMovement({ player, groupRef })

  return (
    <group ref={groupRef}>
      {/* 3Dプレイヤーモデル */}
      <Suspense fallback={<PlayerFallback color={player.color} />}>
        <PlayerModel scale={1} position={[0, -1.7, 0]} />
      </Suspense>
      
      {/* ニックネーム表示 */}
      <PlayerNickname nickname={player.nickname} />
    </group>
  )
}