interface PlayerFallbackProps {
  color?: string | null
}

const DEFAULT_COLOR = '#3B82F6'

/**
 * プレイヤーモデルのローディング中に表示するフォールバック
 */
export function PlayerFallback({ color }: PlayerFallbackProps) {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color={color || DEFAULT_COLOR} />
    </mesh>
  )
}