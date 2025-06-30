'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import { Group, Vector3 } from 'three'
import type { Database } from '@/types/supabase'

type PlayerPosition = Database['public']['Tables']['player_positions']['Row']

interface OtherPlayerProps {
  player: PlayerPosition
}

export default function OtherPlayer({ player }: OtherPlayerProps) {
  const groupRef = useRef<Group>(null)
  const targetPosition = useRef(new Vector3(player.position_x, player.position_y, player.position_z))
  const currentPosition = useRef(new Vector3(player.position_x, player.position_y, player.position_z))

  // プレイヤーの位置が更新されたときにターゲット位置を更新
  useEffect(() => {
    targetPosition.current.set(player.position_x, player.position_y, player.position_z)
  }, [player.position_x, player.position_y, player.position_z, player.user_id])

  // スムーズな位置補間
  useFrame((_, delta) => {
    if (!groupRef.current) return

    // ターゲット位置への線形補間（スムーズな移動）
    currentPosition.current.lerp(targetPosition.current, Math.min(delta * 8, 1)) // 8倍速で補間
    groupRef.current.position.copy(currentPosition.current)
    
    // 回転も同期
    groupRef.current.rotation.y = player.rotation_y
  })

  return (
    <group ref={groupRef}>
      {/* プレイヤーの立方体 */}
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color={player.color || '#3B82F6'} />
      </mesh>
      
      {/* ニックネーム表示（ビルボード効果でカメラ方向を向く） */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 1.5, 0]}
      >
        <Text
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="black"
        >
          {player.nickname || 'Player'}
        </Text>
      </Billboard>
    </group>
  )
}