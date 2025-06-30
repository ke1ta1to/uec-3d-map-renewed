import { Text, Billboard } from '@react-three/drei'

interface PlayerNicknameProps {
  nickname?: string | null
  position?: [number, number, number]
}

const DEFAULT_POSITION: [number, number, number] = [0, 0.8, 0]

/**
 * プレイヤーのニックネーム表示コンポーネント
 * ビルボード効果でカメラ方向を向く
 */
export function PlayerNickname({ 
  nickname, 
  position = DEFAULT_POSITION 
}: PlayerNicknameProps) {
  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
      position={position}
    >
      <Text
        fontSize={0.35}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#001122"
        letterSpacing={0.02}
        maxWidth={200}
        textAlign="center"
      >
        {nickname || 'Player'}
      </Text>
    </Billboard>
  )
}