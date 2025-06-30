import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF, SkeletonUtils } from 'three-stdlib'

type ActionName = 'Armature|mixamo.com|Layer0'

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Beta_Joints: THREE.SkinnedMesh
    Beta_Surface: THREE.SkinnedMesh
    mixamorigHips: THREE.Bone
  }
  materials: {
    Beta_Joints_MAT1: THREE.MeshStandardMaterial
    Beta_HighLimbsGeoSG3: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

interface PlayerModelProps {
  scale?: number | [number, number, number]
  position?: [number, number, number]
}

export function PlayerModel(props: PlayerModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF('/player-model.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as unknown as GLTFResult
  const { actions } = useAnimations(animations, group)

  // 1フレーム目の静的ポーズを設定
  useEffect(() => {
    const action = actions['Armature|mixamo.com|Layer0']
    if (action) {
      action.play()
      action.paused = true
      action.time = 0 // 1フレーム目に固定
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh 
          name="Beta_Joints" 
          geometry={nodes.Beta_Joints.geometry} 
          material={materials.Beta_Joints_MAT1} 
          skeleton={nodes.Beta_Joints.skeleton} 
          rotation={[Math.PI / 2, 0, 0]} 
          scale={0.01} 
        />
        <skinnedMesh 
          name="Beta_Surface" 
          geometry={nodes.Beta_Surface.geometry} 
          material={materials.Beta_HighLimbsGeoSG3} 
          skeleton={nodes.Beta_Surface.skeleton} 
          rotation={[Math.PI / 2, 0, 0]} 
          scale={0.01} 
        />
      </group>
    </group>
  )
}

useGLTF.preload('/player-model.glb')