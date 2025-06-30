import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3, Group } from 'three'
import type { Database } from '@/types/supabase'

type PlayerPosition = Database['public']['Tables']['player_positions']['Row']

interface UsePlayerMovementProps {
  player: PlayerPosition
  groupRef: React.RefObject<Group | null>
}

// 定数
const WARP_THRESHOLD = 5 // ワープ検出の閾値
const LERP_SPEED = 8 // 位置補間速度
const MAX_LERP_FACTOR = 0.15 // 最大補間係数
const MOVEMENT_THRESHOLD = 0.01 // 移動検出の閾値
const ROTATION_SPEED = 10 // 回転速度

/**
 * 他プレイヤーのスムーズな移動と回転を管理するカスタムフック
 */
export function usePlayerMovement({ player, groupRef }: UsePlayerMovementProps) {
  const targetPosition = useRef(new Vector3(player.position_x, player.position_y, player.position_z))
  const currentPosition = useRef(new Vector3(player.position_x, player.position_y, player.position_z))
  const previousPosition = useRef(new Vector3(player.position_x, player.position_y, player.position_z))
  const currentRotation = useRef(0)

  // プレイヤーの位置が更新されたときにターゲット位置を更新
  useEffect(() => {
    const newTargetPos = new Vector3(player.position_x, player.position_y, player.position_z)
    const currentDistance = currentPosition.current.distanceTo(newTargetPos)
    
    // 大きな位置の変化（ワープ）を検出して即座に同期
    if (currentDistance > WARP_THRESHOLD) {
      currentPosition.current.copy(newTargetPos)
    }
    
    targetPosition.current.copy(newTargetPos)
  }, [player.position_x, player.position_y, player.position_z, player.user_id])

  // 角度差を正規化する関数
  const normalizeAngleDifference = (diff: number): number => {
    let normalizedDiff = diff
    if (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI
    if (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI
    return normalizedDiff
  }

  // スムーズな位置補間と回転
  useFrame((_, delta) => {
    if (!groupRef.current) return

    // 前回の位置を保存
    previousPosition.current.copy(currentPosition.current)
    
    // ターゲット位置への線形補間
    currentPosition.current.lerp(targetPosition.current, Math.min(delta * LERP_SPEED, MAX_LERP_FACTOR))
    groupRef.current.position.copy(currentPosition.current)
    
    // 移動方向に基づいて回転を計算
    const movementDirection = new Vector3()
    movementDirection.subVectors(currentPosition.current, previousPosition.current)
    
    // 移動している場合（最小閾値を設定）
    if (movementDirection.length() > MOVEMENT_THRESHOLD) {
      const targetRotation = Math.atan2(movementDirection.x, movementDirection.z)
      const rotationDiff = targetRotation - currentRotation.current
      const normalizedDiff = normalizeAngleDifference(rotationDiff)
      
      currentRotation.current += normalizedDiff * delta * ROTATION_SPEED
      groupRef.current.rotation.y = currentRotation.current
    }
  })
}