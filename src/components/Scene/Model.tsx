"use client";

import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { Group } from "three";

interface ModelProps {
  onLoad?: () => void;
}

export default function Model({ onLoad }: ModelProps) {
  const groupRef = useRef<Group>(null);
  const [isClient, setIsClient] = useState(false);

  // Hookを条件分岐の外で呼び出す
  const gltf = useGLTF("/api/model");

  useEffect(() => {
    setIsClient(true);
    useGLTF.preload("/api/model");
  }, []);

  useEffect(() => {
    if (gltf && onLoad) {
      onLoad();
    }
  }, [gltf, onLoad]);

  // クライアントサイドでのみ表示
  if (!isClient) {
    return null;
  }

  // 将来のクリック機能用のハンドラー（現在は未使用）
  const handleClick = (event: MouseEvent) => {
    // 将来的にここで建物情報の表示などを実装
    console.log("3D model clicked:", event);
  };

  return (
    <group ref={groupRef} onClick={handleClick}>
      <primitive object={gltf.scene} />
    </group>
  );
}
