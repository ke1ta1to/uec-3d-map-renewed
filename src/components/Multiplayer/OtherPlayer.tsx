'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
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
  useFrame((state, delta) => {
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
        <meshStandardMaterial color={player.color} />
      </mesh>
      
      {/* ニックネーム表示（後で実装） */}
      {/* <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {player.nickname}
      </Text> */}
    </group>
  )
}